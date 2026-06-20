import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { createScaleVariants, motionTransitions } from '../../config/motion';

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
  const modalRef = useRef(null);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();
  const modalVariants = createScaleVariants(shouldReduceMotion);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (triggerRef.current) {
        setIsDark(!!triggerRef.current.closest('.dark'));
      }
      window.requestAnimationFrame(() => modalRef.current?.focus());
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
                  transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={title ? titleId : undefined}
                  tabIndex={-1}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`relative w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden glass-panel z-10 ${sizeClasses[size]} ${className}`}
                >
                  {/* Modal Header */}
                  {title && (
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5">
                      <h3 id={titleId} className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                        {title}
                      </h3>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded-lg p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FiX className="h-5 w-5" />
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
