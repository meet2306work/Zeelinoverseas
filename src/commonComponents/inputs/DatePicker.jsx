import React from 'react';
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';

export default function DatePicker({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  min,
  max,
  ...props
}) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
          {label} {required && <span className="text-brand-danger">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 text-brand-text-secondary pointer-events-none">
          <FiCalendar className="h-5 w-5" />
        </div>

        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          className={`w-full rounded-xl border text-sm text-brand-text-primary dark:text-slate-100 transition-all duration-200 outline-none pl-10 pr-3.5 py-2.5 bg-brand-card dark:bg-slate-900 
            ${error 
              ? 'border-brand-danger focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
              : 'border-brand-border dark:border-slate-800 focus:border-secondary focus:ring-1 focus:ring-secondary'
            }
            disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-850 dark:disabled:text-slate-500
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-brand-danger font-medium flex items-center gap-1">
          <FiAlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-brand-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
}
