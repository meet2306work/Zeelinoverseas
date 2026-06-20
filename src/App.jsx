import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MotionConfig } from 'framer-motion';
import { fetchCurrentUser } from './redux/slices/authSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';
import AppRoutes from './routes/AppRoutes';
import ToastProvider from './commonComponents/toasts/ToastProvider';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(fetchCurrentUser());
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return (
    <MotionConfig reducedMotion="user">
      <AppRoutes />
      <ToastProvider />
    </MotionConfig>
  );
}
