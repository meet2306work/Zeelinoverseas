import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from './orderSlice';

// Load initial cart state from localStorage
const loadCartState = () => {
  try {
    const serializedCart = localStorage.getItem('zeelin_cart');
    if (serializedCart === null) {
      return { items: [], totalQuantity: 0, totalPrice: 0 };
    }
    return JSON.parse(serializedCart);
  } catch {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

const saveCartState = (state) => {
  try {
    localStorage.setItem('zeelin_cart', JSON.stringify({
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
    }));
  } catch {
    // Ignore write errors
  }
};

const recalcTotals = (state) => {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.qty, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
};

const initialState = loadCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      // Guard: reject Out-of-Stock or Archived products (Bug #13)
      if (
        newItem.availabilityStatus === 'Out Of Stock' ||
        newItem.availabilityStatus === 'Archived'
      ) {
        return; // silently skip — UI should show its own error toast
      }

      const existingItem = state.items.find(item => item.id === newItem.id);

      // Fix Bug #15: ensure qty added is always a positive integer (minimum 1)
      const qtyToAdd = Math.max(1, Math.floor(newItem.qty !== undefined ? newItem.qty : 1));

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,          // stored at add-time; use updateCartPrices to refresh
          qty: qtyToAdd,
          image: newItem.image || '',
          availabilityStatus: newItem.availabilityStatus || 'In Stock',
        });
      } else {
        existingItem.qty += qtyToAdd;
        // Fix Bug #15: if qty somehow hits 0 or below after addition, remove item
        if (existingItem.qty <= 0) {
          state.items = state.items.filter(item => item.id !== newItem.id);
        }
      }

      recalcTotals(state);
      saveCartState(state);
    },

    updateItemQty: (state, action) => {
      // Dedicated action for changing quantity (avoids negative-qty abuse via addToCart)
      const { id, qty } = action.payload;
      const safeQty = Math.max(1, Math.floor(qty));
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.qty = safeQty;
        recalcTotals(state);
        saveCartState(state);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      recalcTotals(state);
      saveCartState(state);
    },

    // Bug #14: Allow refreshing cart prices from the latest product data
    updateCartPrices: (state, action) => {
      // action.payload: array of { id, price, availabilityStatus }
      const priceMap = {};
      action.payload.forEach(p => { priceMap[p.id] = p; });
      state.items = state.items.filter(item => {
        const latest = priceMap[item.id];
        if (!latest) return true; // keep if product not found (will be validated at checkout)
        if (latest.availabilityStatus === 'Archived') return false; // drop archived
        item.price = latest.price;
        item.availabilityStatus = latest.availabilityStatus;
        return true;
      });
      recalcTotals(state);
      saveCartState(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartState(state);
    },
  },

  extraReducers: (builder) => {
    // Bug #11: Automatically clear cart on successful order creation
    builder.addCase(createOrder.fulfilled, (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartState(state);
    });
  },
});

export const {
  addToCart,
  updateItemQty,
  removeFromCart,
  updateCartPrices,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartCount = (state) => state.cart.totalQuantity;
