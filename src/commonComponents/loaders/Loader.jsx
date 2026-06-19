import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

export default function Loader({
  type = 'spinner', // 'spinner' | 'page' | 'skeleton' | 'skeleton-card'
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const sizeMap = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (type === 'page') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-panel">
          <ImSpinner2 className="animate-spin text-teal-500 h-10 w-10" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Loading Platform...
          </span>
        </div>
      </div>
    );
  }

  if (type === 'skeleton-card') {
    return (
      <div className={`animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 flex flex-col gap-4 ${className}`}>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        </div>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse flex flex-col gap-2 w-full ${className}`}>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ImSpinner2 className={`animate-spin text-teal-600 dark:text-teal-500 ${sizeMap[size]}`} />
    </div>
  );
}
