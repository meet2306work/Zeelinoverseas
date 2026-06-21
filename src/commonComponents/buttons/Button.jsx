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
    primary: 'bg-accent hover:bg-accent-light text-primary shadow-md hover:shadow-lg focus:ring-accent border border-accent/20 font-bold',
    secondary: 'bg-primary-medium hover:bg-primary-light text-accent hover:text-accent-light focus:ring-accent border border-primary-border',
    outline: 'border border-accent/40 text-accent hover:bg-accent/10 focus:ring-accent',
    danger: 'bg-brand-danger hover:bg-red-650 text-white focus:ring-brand-danger shadow-sm',
    success: 'bg-brand-success hover:bg-emerald-650 text-white focus:ring-brand-success shadow-sm',
    ghost: 'text-primary-slate hover:text-white hover:bg-primary-medium/40',
    gold: 'bg-accent hover:bg-accent-light text-primary font-bold focus:ring-accent shadow-sm shadow-accent/15 border border-accent/20',
    brandGradient: 'bg-gradient-to-r from-accent to-accent-light text-primary font-extrabold shadow-lg shadow-accent/15 border border-accent/20 hover:from-accent-light hover:to-accent',
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
      whileHover={!shouldReduceMotion && !isDisabled ? { y: -2, scale: 1.02, boxShadow: '0 8px 20px -6px rgba(212,164,55,0.35)' } : undefined}
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
