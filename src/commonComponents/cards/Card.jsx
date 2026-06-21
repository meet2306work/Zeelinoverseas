import { motion, useReducedMotion } from 'framer-motion';
import { motionTransitions } from '../../config/motion';

export default function Card({
  children,
  variant = 'default', // 'default' | 'glass' | 'borderless' | 'glow'
  hover = true,
  className = '',
  onClick,
}) {
  const shouldReduceMotion = useReducedMotion();
  const isInteractive = Boolean(onClick);
  const baseClasses = 'rounded-2xl p-5 bg-background-surface border border-border-default/60 transition-[border-color,box-shadow,background-color] duration-brand-base text-text-primary';
  
  const variants = {
    default: 'shadow-premium hover:border-accent-gold/40 hover:shadow-card-hover',
    glass: 'glass-panel border-accent-gold/15',
    borderless: 'border-none shadow-none p-0 bg-transparent dark:bg-transparent text-inherit',
    glow: 'shadow-premium border-accent-gold/25 relative hover:border-accent-gold/50 hover:shadow-[0_0_25px_rgba(201,154,62,0.15)]',
  };

  const hoverClasses = hover && variant !== 'borderless'
    ? `hover:shadow-card-hover ${isInteractive ? 'cursor-pointer' : ''}`
    : '';

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover && variant !== 'borderless' && !shouldReduceMotion ? { y: -6, scale: 1.01 } : undefined}
      whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.99 } : undefined}
      transition={motionTransitions.interface}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}
