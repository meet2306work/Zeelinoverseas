import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right', // 'left' | 'right'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
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
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  };

  return (
    <>
      <span ref={triggerRef} className="hidden" aria-hidden="true" />
      {createPortal(
        <div className={isDark ? 'dark' : ''}>
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex overflow-hidden">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs"
                />

                {/* Drawer Container */}
                <motion.div
                  variants={slideVariants[position]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                  className={`fixed inset-y-0 ${position === 'left' ? 'left-0' : 'right-0'} w-full flex flex-col bg-white dark:bg-slate-900 border-${position === 'left' ? 'r' : 'l'} border-slate-200 dark:border-slate-800 shadow-2xl z-10 ${sizeClasses[size]} ${className}`}
                >
                  {/* Drawer Header */}
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

                  {/* Drawer Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5.5">
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

