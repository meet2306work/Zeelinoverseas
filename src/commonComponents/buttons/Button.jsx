import { ImSpinner2 } from 'react-icons/im';
import { motion, useReducedMotion } from 'framer-motion';
import { motionSprings } from '../../config/motion';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'gold'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'xl'
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left', // 'left' | 'right'
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || isLoading;
  const baseStyles = 'relative inline-flex items-center justify-center overflow-hidden font-semibold rounded-xl transition-[color,background-color,border-color,box-shadow] duration-brand-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 focus:ring-slate-500 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md hover:shadow-blue-500/15',
    outline: 'border border-brand-border dark:border-slate-800 text-brand-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500',
    danger: 'bg-brand-danger hover:bg-red-600 text-white focus:ring-brand-danger shadow-sm hover:shadow-md hover:shadow-red-500/15',
    success: 'bg-brand-success hover:bg-emerald-600 text-white focus:ring-brand-success shadow-sm hover:shadow-md hover:shadow-emerald-500/15',
    ghost: 'text-brand-text-secondary hover:text-brand-text-primary dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
    gold: 'bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-bold focus:ring-amber-500 shadow-sm hover:shadow-md hover:shadow-amber-500/15',
    brandGradient: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl focus:ring-blue-500 border border-transparent',
  };

  const sizes = {
    sm: 'px-brand-sm py-brand-xs text-xs rounded-lg',
    md: 'px-brand-md py-brand-sm text-sm',
    lg: 'px-brand-lg py-brand-md text-base',
    xl: 'px-brand-xl py-brand-lg text-lg rounded-2xl',
  };

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!shouldReduceMotion && !isDisabled ? { y: -1 } : undefined}
      whileTap={!shouldReduceMotion && !isDisabled ? { scale: 0.98 } : undefined}
      transition={motionSprings.responsive}
      aria-busy={isLoading || undefined}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <ImSpinner2 className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0" />
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="-ml-1 mr-2 h-4 w-4 shrink-0" />
      )}
      
      <span>{children}</span>
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="ml-2 -mr-1 h-4 w-4 shrink-0" />
      )}
    </motion.button>
  );
}
