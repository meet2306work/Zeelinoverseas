import { ImSpinner2 } from 'react-icons/im';
import Skeleton, { SkeletonCard } from './Skeleton';

export default function Loader({
  type = 'spinner', // 'spinner' | 'page' | 'skeleton' | 'skeleton-card'
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const sizeMap = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (type === 'page') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-panel">
          <ImSpinner2 className="animate-spin text-teal-500 h-10 w-10" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Loading Platform...
          </span>
        </div>
      </div>
    );
  }

  if (type === 'skeleton-card') {
    return <SkeletonCard className={className} />;
  }

  if (type === 'skeleton') {
    return <Skeleton lines={3} className={className} />;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ImSpinner2 className={`animate-spin text-teal-600 dark:text-teal-500 ${sizeMap[size]}`} />
    </div>
  );
}
