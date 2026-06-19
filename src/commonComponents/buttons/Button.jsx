import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 focus:ring-slate-500 shadow-sm active:scale-[0.98]',
    secondary: 'bg-secondary hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm active:scale-[0.98]',
    outline: 'border border-brand-border dark:border-slate-800 text-brand-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500 active:scale-[0.98]',
    danger: 'bg-brand-danger hover:bg-red-750 text-white focus:ring-brand-danger shadow-sm active:scale-[0.98]',
    success: 'bg-brand-success hover:bg-emerald-600 text-white focus:ring-brand-success shadow-sm active:scale-[0.98]',
    ghost: 'text-brand-text-secondary hover:text-brand-text-primary dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]',
    gold: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold focus:ring-amber-500 shadow-sm active:scale-[0.98]',
    brandGradient: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] focus:ring-blue-500 border border-transparent',
  };

  const sizes = {
    sm: 'px-brand-sm py-brand-xs text-xs rounded-lg',
    md: 'px-brand-md py-brand-sm text-sm',
    lg: 'px-brand-lg py-brand-md text-base',
    xl: 'px-brand-xl py-brand-lg text-lg rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
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
    </button>
  );
}
