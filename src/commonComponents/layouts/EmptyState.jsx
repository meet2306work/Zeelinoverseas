import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from '../buttons/Button';

export default function EmptyState({
  title = 'No Records Found',
  description = 'There is no data to show right now.',
  icon: Icon = FiInbox,
  actionLabel,
  onActionClick,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4 shadow-sm border border-slate-100 dark:border-slate-800/80">
        <Icon className="h-10 w-10" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6.5 leading-relaxed">
        {description}
      </p>

      {actionLabel && onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
