import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createFadeUpVariants } from '../../config/motion';

export default function PageTransition({ children, routeKey, className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = createFadeUpVariants(shouldReduceMotion, 12);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
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
