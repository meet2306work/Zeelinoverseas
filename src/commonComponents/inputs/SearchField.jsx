import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchField({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  disabled = false,
  className = '',
  ...props
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3 text-brand-text-secondary pointer-events-none">
        <FiSearch className="h-4 w-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-brand-border dark:border-slate-800 text-sm text-brand-text-primary dark:text-slate-100 transition-all duration-200 outline-none pl-9 pr-8 py-2 bg-brand-card dark:bg-slate-900 focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-850"
        {...props}
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-1 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
