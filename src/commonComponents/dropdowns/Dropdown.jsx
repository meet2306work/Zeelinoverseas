import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiChevronDown, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export default function Dropdown({
  // General props
  disabled = false,
  isLoading = false,
  className = '',

  // Menu Mode props
  trigger,
  items = [], // [{ label: 'Profile', onClick: () => {}, icon: Icon }]
  align = 'right', // 'left' | 'right'

  // Select Mode props
  label,
  name,
  value,
  onChange,
  options = [], // [{ label: 'Option 1', value: 'opt1' }]
  placeholder = 'Select an option',
  searchable = true,
  required = false,
  error,
  helperText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const isSelectMode = !!options && options.length > 0;

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    (opt?.label || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens in Select Mode
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setFocusedIndex(-1);
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled || isLoading) return;

    const itemsCount = isSelectMode ? filteredOptions.length : items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex((prev) => (prev + 1 >= itemsCount ? 0 : prev + 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex((prev) => (prev - 1 < 0 ? itemsCount - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen) {
        if (focusedIndex >= 0 && focusedIndex < itemsCount) {
          if (isSelectMode) {
            const selected = filteredOptions[focusedIndex];
            if (onChange) onChange({ target: { name, value: selected.value } });
          } else {
            const clickedItem = items[focusedIndex];
            if (clickedItem.onClick) clickedItem.onClick();
          }
          setIsOpen(false);
        } else if (isSelectMode && filteredOptions.length > 0) {
          // Select first option as default if pressing enter with no manual highlight
          const selected = filteredOptions[0];
          if (onChange) onChange({ target: { name, value: selected.value } });
          setIsOpen(false);
        }
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  return (
    <div
      className={`relative inline-block text-left w-full ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {isSelectMode ? (
        // ================= SELECT MODE =================
        <div className="w-full flex flex-col gap-1.5">
          {label && (
            <label className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
              {label} {required && <span className="text-brand-danger">*</span>}
            </label>
          )}

          <div
            onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between rounded-xl border text-sm transition-all duration-200 outline-none px-3.5 py-2.5 bg-brand-card dark:bg-slate-900 cursor-pointer select-none
              ${disabled ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-brand-border dark:border-slate-800' : 'border-brand-border dark:border-slate-800'}
              ${error ? 'border-brand-danger focus:ring-1 focus:ring-brand-danger' : 'hover:border-slate-400 dark:hover:border-slate-700'}
              ${isOpen && !error ? 'ring-2 ring-secondary/20 border-secondary' : ''}
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <ImSpinner2 className="animate-spin h-4 w-4" />
                <span>Loading options...</span>
              </div>
            ) : (
              <span className={selectedOption ? 'text-brand-text-primary dark:text-slate-250' : 'text-brand-text-secondary'}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}

            <FiChevronDown className={`h-4.5 w-4.5 text-brand-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Options Panel */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-brand-card dark:bg-slate-900 border border-brand-border dark:border-slate-800 shadow-lg z-50 py-1.5 focus:outline-none flex flex-col">
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
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-brand-border dark:border-slate-805 bg-slate-50 dark:bg-slate-950 outline-none focus:border-secondary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div ref={listRef} className="overflow-y-auto flex-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-brand-text-secondary text-center">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isSelected = value === opt.value;
                    const isFocused = focusedIndex === idx;
                    return (
                      <button
                        key={opt.value || idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onChange) onChange({ target: { name, value: opt.value } });
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3.5 py-2 text-sm text-left transition-colors
                          ${isSelected ? 'bg-secondary/10 text-secondary font-semibold' : 'text-brand-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
                          ${isFocused ? 'bg-slate-100 dark:bg-slate-800' : ''}
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
      ) : (
        // ================= MENU MODE =================
        <>
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="cursor-pointer"
          >
            {trigger}
          </div>

          {isOpen && (
            <div
              ref={listRef}
              className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 origin-top-right rounded-xl bg-brand-card dark:bg-slate-900 border border-brand-border dark:border-slate-800 shadow-lg z-50 py-1 transition-all duration-105`}
            >
              {items.map((item, idx) => {
                const Icon = item.icon;
                const isFocused = focusedIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      if (item.onClick) item.onClick();
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm text-brand-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left
                      ${isFocused ? 'bg-slate-100 dark:bg-slate-800' : ''}
                    `}
                  >
                    {Icon && <Icon className="mr-3 h-4 w-4 text-brand-text-secondary shrink-0" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
