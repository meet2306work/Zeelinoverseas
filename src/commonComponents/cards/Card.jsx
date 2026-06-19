import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'glass' | 'borderless' | 'glow'
  hover = true,
  className = '',
  onClick,
}) {
  const baseClasses = 'rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300';
  
  const variants = {
    default: 'shadow-premium',
    glass: 'glass-card border-slate-200/40 dark:border-slate-800/40',
    borderless: 'border-none shadow-none p-0 bg-transparent dark:bg-transparent',
    glow: 'shadow-premium border-teal-500/10 dark:border-teal-500/5 relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-teal-500/10 dark:before:border-teal-400/5 before:pointer-events-none',
  };

  const hoverClasses = hover && variant !== 'borderless'
    ? 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/40 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
