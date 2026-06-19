import React, { useId, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  className = '',
  disabled = false,
  required = false,
  suggestions = [],
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();
  const suggestionsId = `${inputId}-suggestions`;

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const uniqueSuggestions = [...new Set(suggestions.filter(Boolean))];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 dark:text-slate-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <input
          type={currentType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          list={uniqueSuggestions.length > 0 ? suggestionsId : undefined}
          className={`w-full rounded-lg border text-sm text-brand-text-primary dark:text-slate-100 transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'} 
            ${isPassword ? 'pr-10' : 'pr-3.5'} 
            py-2.5 bg-white dark:bg-slate-900 
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }
            disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500
          `}
          {...props}
        />

        {uniqueSuggestions.length > 0 && (
          <datalist id={suggestionsId}>
            {uniqueSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        )}

        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
