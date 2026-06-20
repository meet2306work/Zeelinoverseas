import { motion, useReducedMotion } from 'framer-motion';
import { createFadeUpVariants, createStaggerContainer } from '../../config/motion';

export function Reveal({ children, className = '', delay = 0, distance = 20, amount = 0.16 }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = createFadeUpVariants(shouldReduceMotion, distance);
  const visible = {
    ...variants.visible,
    transition: {
      ...variants.visible.transition,
      delay: shouldReduceMotion ? 0 : delay,
    },
  };

  return (
    <motion.div
      variants={{ ...variants, visible }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className = '', stagger = 0.07, amount = 0.12 }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={createStaggerContainer(shouldReduceMotion, stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', distance = 16 }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div variants={createFadeUpVariants(shouldReduceMotion, distance)} className={className}>
      {children}
    </motion.div>
  );
}
