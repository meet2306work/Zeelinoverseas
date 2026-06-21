import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { motionTransitions } from '../../config/motion';

export default function PageTransition({ children, routeKey, className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const activeTransition = isAdmin ? motionTransitions.admin : motionTransitions.storefront;

  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20, 
      scale: shouldReduceMotion ? 1 : 0.98 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion ? { duration: 0 } : activeTransition
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -15,
      scale: shouldReduceMotion ? 1 : 0.99,
      transition: shouldReduceMotion ? { duration: 0 } : motionTransitions.exit
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey || location.pathname}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`flex-1 flex flex-col ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
