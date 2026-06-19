import React from 'react';

export default function Textarea({
  label,
  placeholder = '',
  name,
  value,
  onChange,
  error,
  helperText,
  rows = 4,
  className = '',
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`w-full rounded-lg border text-sm text-brand-text-primary dark:text-slate-100 transition-all duration-200 outline-none px-3.5 py-2.5 bg-white dark:bg-slate-900 resize-y
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
          }
          disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500
        `}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
