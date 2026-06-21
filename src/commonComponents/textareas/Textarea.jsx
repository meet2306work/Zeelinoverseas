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
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
        className={`w-full rounded-lg border text-sm text-text-primary transition-all duration-200 outline-none px-3.5 py-2.5 bg-background-primary/40 focus:bg-background-surface resize-y
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-border-default focus:border-accent-gold focus:ring-1 focus:ring-accent-gold'
          }
          disabled:bg-background-primary/20 disabled:text-text-secondary/50
        `}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
}
