import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className = '',
}) {
  const [isDark, setIsDark] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (triggerRef.current) {
        setIsDark(!!triggerRef.current.closest('.dark'));
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full h-full rounded-none',
  };

  return (
    <>
      <span ref={triggerRef} className="hidden" aria-hidden="true" />
      {createPortal(
        <div className={isDark ? 'dark' : ''}>
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', duration: 0.3 }}
                  className={`relative w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden glass-panel z-10 ${sizeClasses[size]} ${className}`}
                >
                  {/* Modal Header */}
                  {title && (
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5">
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                        {title}
                      </h3>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <IoClose className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {/* Modal Body */}
                  <div className="px-6 py-5.5 max-h-[75vh] overflow-y-auto">
                    {children}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}

