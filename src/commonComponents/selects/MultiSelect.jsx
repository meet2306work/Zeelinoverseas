import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiChevronDown, FiAlertCircle, FiX, FiCheck } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export default function MultiSelect({
  label,
  name,
  value = [], // Array of values e.g. ['opt1', 'opt2']
  onChange,
  options = [], // [{ label: 'Option 1', value: 'opt1' }]
  placeholder = 'Select options',
  disabled = false,
  isLoading = false,
  required = false,
  error,
  helperText,
  searchable = true,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggleOption = (optVal) => {
    let newValue;
    if (value.includes(optVal)) {
      newValue = value.filter((val) => val !== optVal);
    } else {
      newValue = [...value, optVal];
    }
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleRemoveValue = (e, optVal) => {
    e.stopPropagation();
    const newValue = value.filter((val) => val !== optVal);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: [] } });
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
          {label} {required && <span className="text-brand-danger">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border text-sm transition-all duration-205 outline-none px-3.5 py-2 bg-brand-card dark:bg-slate-900 cursor-pointer select-none min-h-[42px]
          ${disabled ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-brand-border dark:border-slate-800' : 'border-brand-border dark:border-slate-800'}
          ${error ? 'border-brand-danger focus:ring-1 focus:ring-brand-danger' : 'hover:border-slate-400 dark:hover:border-slate-700'}
          ${isOpen && !error ? 'ring-2 ring-secondary/20 border-secondary' : ''}
        `}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <ImSpinner2 className="animate-spin h-4 w-4" />
              <span>Loading...</span>
            </div>
          ) : value.length === 0 ? (
            <span className="text-brand-text-secondary">{placeholder}</span>
          ) : (
            value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 bg-secondary/15 text-secondary text-xs font-bold px-2 py-0.5 rounded-md border border-secondary/20"
                >
                  <span>{opt ? opt.label : val}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveValue(e, val)}
                      className="hover:text-blue-800 transition-colors"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  )}
                </span>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-1.5 text-brand-text-secondary shrink-0">
          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="hover:text-brand-danger transition-colors text-xs font-semibold px-1 py-0.5"
            >
              Clear
            </button>
          )}
          <FiChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-brand-card dark:bg-slate-900 border border-brand-border dark:border-slate-800 shadow-lg z-50 py-1.5 focus:outline-none flex flex-col">
          {searchable && (
            <div className="px-2 pb-1.5 border-b border-brand-border/40 dark:border-slate-800/40 mb-1">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-2.5 h-4 w-4 text-brand-text-secondary" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-brand-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-secondary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-brand-text-secondary text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOption(opt.value);
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-sm text-left transition-colors
                      ${isSelected ? 'bg-secondary/5 text-secondary font-semibold' : 'text-brand-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <FiCheck className="h-4 w-4 text-secondary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

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
