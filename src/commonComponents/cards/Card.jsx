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
  const baseClasses = 'rounded-2xl p-5 bg-brand-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-[border-color,box-shadow,background-color] duration-brand-base';
  
  const variants = {
    default: 'shadow-premium',
    glass: 'glass-card border-slate-200/40 dark:border-slate-800/40',
    borderless: 'border-none shadow-none p-0 bg-transparent dark:bg-transparent',
    glow: 'shadow-premium border-teal-500/10 dark:border-teal-500/5 relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-teal-500/10 dark:before:border-teal-400/5 before:pointer-events-none',
  };

  const hoverClasses = hover && variant !== 'borderless'
    ? `hover:shadow-card-hover dark:hover:shadow-black/40 ${isInteractive ? 'cursor-pointer' : ''}`
    : '';

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover && variant !== 'borderless' && !shouldReduceMotion ? { y: -4 } : undefined}
      whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.995 } : undefined}
      transition={motionTransitions.interface}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}
