import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './redux/slices/authSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(fetchCurrentUser());
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return <AppRoutes />;
}
