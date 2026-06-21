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
  const baseStyles = 'relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap font-semibold leading-none rounded-xl transition-[color,background-color,border-color,box-shadow] duration-brand-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-accent-gold hover:bg-accent-gold-hover text-text-on-accent shadow-md hover:shadow-lg focus:ring-accent-gold border border-accent-gold/20 font-bold',
    secondary: 'bg-black-accent hover:bg-black-accent/90 text-text-on-dark focus:ring-black-accent border border-border-default/20',
    outline: 'border border-accent-gold text-accent-gold hover:bg-accent-gold/10 focus:ring-accent-gold',
    danger: 'bg-brand-danger hover:bg-red-650 text-white focus:ring-brand-danger shadow-sm',
    success: 'bg-brand-success hover:bg-emerald-650 text-white focus:ring-brand-success shadow-sm',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-background-surface/40',
    gold: 'bg-accent-gold hover:bg-accent-gold-hover text-text-on-accent font-bold focus:ring-accent-gold shadow-sm shadow-accent-gold/15 border border-accent-gold/20',
    brandGradient: 'bg-gradient-to-r from-accent-gold to-accent-gold-hover text-text-on-accent font-extrabold shadow-lg shadow-accent-gold/15 border border-accent-gold/20',
  };

  const sizes = {
    sm: 'min-h-9 px-3 py-2 text-xs rounded-lg',
    md: 'min-h-11 px-4 py-2.5 text-sm',
    lg: 'min-h-12 px-6 py-3 text-base',
    xl: 'min-h-14 px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!shouldReduceMotion && !isDisabled ? { y: -2, scale: 1.02, boxShadow: '0 8px 20px -6px rgba(201,154,62,0.35)' } : undefined}
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
