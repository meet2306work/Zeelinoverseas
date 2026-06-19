import { createSlice } from '@reduxjs/toolkit';

// Load initial cart state from localStorage
const loadCartState = () => {
  try {
    const serializedCart = localStorage.getItem('zeelin_cart');
    if (serializedCart === null) {
      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    };
  }
};

const saveCartState = (state) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem('zeelin_cart', serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = loadCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      const qtyToAdd = newItem.qty !== undefined ? newItem.qty : 1;
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          qty: qtyToAdd,
          image: newItem.image || '',
        });
      } else {
        existingItem.qty += qtyToAdd;
        // If qty falls to 0 or below, remove item
        if (existingItem.qty <= 0) {
          state.items = state.items.filter(item => item.id !== newItem.id);
        }
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.qty, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      saveCartState(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.qty, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      saveCartState(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export const selectCart = (state) => state.cart;
