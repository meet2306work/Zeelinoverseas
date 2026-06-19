import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../buttons/Button';

export default function ErrorState({
  title = 'Something Went Wrong',
  description = 'An error occurred while loading this section. Please try again.',
  actionLabel = 'Retry',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-red-200/40 dark:border-red-950/20 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <div className="rounded-2xl p-4 bg-red-50 dark:bg-red-950/20 text-red-500 mb-4 shadow-sm">
        <FiAlertTriangle className="h-10 w-10" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6.5 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <Button variant="outline" className="border-red-200 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-600 dark:text-red-400" onClick={onRetry}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
