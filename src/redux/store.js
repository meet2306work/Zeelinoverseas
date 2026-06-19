import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import rfqReducer from './slices/rfqSlice';
import ordersReducer from './slices/orderSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import settingsReducer from './slices/settingsSlice';
import wishlistReducer from './slices/wishlistSlice';
import ticketReducer from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    rfq: rfqReducer,
    orders: ordersReducer,
    categories: categoryReducer,
    products: productReducer,
    settings: settingsReducer,
    wishlist: wishlistReducer,
    tickets: ticketReducer,
  },
});

export default store;
