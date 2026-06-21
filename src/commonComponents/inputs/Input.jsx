import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motionTransitions } from '../../config/motion';

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
  onFocus,
  onBlur,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const inputId = useId();
  const suggestionsId = `${inputId}-suggestions`;

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const uniqueSuggestions = [...new Set(suggestions.filter(Boolean))];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <motion.div
        animate={{ scale: isFocused && !shouldReduceMotion ? 1.005 : 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.admin}
        className="relative flex items-center"
      >
        {Icon && (
          <div className="absolute left-3 text-text-secondary/60">
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
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? `${inputId}-message` : undefined}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          list={uniqueSuggestions.length > 0 ? suggestionsId : undefined}
          className={`w-full rounded-lg border text-sm text-text-primary transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'} 
            ${isPassword ? 'pr-10' : 'pr-3.5'} 
            py-2.5 bg-background-primary/40 focus:bg-background-surface
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-border-default focus:border-accent-gold focus:ring-1 focus:ring-accent-gold'
            }
            disabled:bg-background-primary/20 disabled:text-text-secondary/50
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
            className="absolute right-3 text-text-secondary/60 hover:text-text-primary transition-colors"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {error ? (
          <motion.p id={`${inputId}-message`} key="error" initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500 font-medium">{error}</motion.p>
        ) : helperText ? (
          <motion.p id={`${inputId}-message`} key="helper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-text-secondary">{helperText}</motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
