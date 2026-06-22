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
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg/95 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-accent/20 bg-primary-light/95 shadow-2xl relative overflow-hidden max-w-xs w-full text-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl border-2 border-accent bg-primary-medium shadow-lg shadow-accent/15">
            <span className="text-xl font-black tracking-wider text-accent">ZO</span>
            <div className="absolute -inset-1 rounded-2xl border border-dashed border-accent/40 animate-spin" />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-sm font-extrabold tracking-widest text-slate-150 font-display uppercase">
              ZEELIN OVERSEAS
            </span>
            {/* OLD (commented out - do not delete)
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest animate-pulse">
              Securing Trade Desk...
            </span>
            */}
            {/* NEW */}
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest animate-pulse">
              Preparing Store...
            </span>
          </div>
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
      <ImSpinner2 className={`animate-spin text-accent ${sizeMap[size]}`} />
    </div>
  );
}
