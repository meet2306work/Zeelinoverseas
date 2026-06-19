import React from 'react';
import Modal from './Modal';
import Button from '../buttons/Button';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  isLoading = false,
  icon: Icon = FiAlertTriangle,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        {/* Squircle Badge Container */}
        <div 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border shadow-sm transition-all duration-300
            ${isDanger 
              ? 'bg-gradient-to-br from-red-50 to-red-100/50 text-red-500 border-red-200/30 shadow-red-500/5 dark:from-red-950/40 dark:to-red-900/20 dark:text-red-400 dark:border-red-900/30' 
              : 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-500 border-amber-200/30 shadow-amber-500/5 dark:from-amber-950/40 dark:to-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
            }
          `}
        >
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight font-display">
          {title}
        </h3>
        
        <p className="text-sm text-slate-550 dark:text-slate-400 mb-7 leading-relaxed px-1">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            className={`flex-1 shadow-md shadow-brand-danger/10`}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
