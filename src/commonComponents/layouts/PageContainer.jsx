import React from 'react';

export default function PageContainer({
  children,
  maxWidth = 'max-w-7xl', // 'max-w-3xl' | 'max-w-5xl' | 'max-w-7xl' | 'max-w-full'
  className = '',
  ...props
}) {
  return (
    <div
      className={`mx-auto w-full px-brand-md sm:px-brand-lg lg:px-brand-xl ${maxWidth} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
