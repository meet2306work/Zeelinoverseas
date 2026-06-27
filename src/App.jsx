import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MotionConfig } from 'framer-motion';
import { fetchCurrentUser, logout } from './redux/slices/authSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';
import AppRoutes from './routes/AppRoutes';
import ToastProvider from './commonComponents/toasts/ToastProvider';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => dispatch(fetchWishlist()))
      .catch(() => {});

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <MotionConfig reducedMotion="user">
      <AppRoutes />
      <ToastProvider />
    </MotionConfig>
  );
}
