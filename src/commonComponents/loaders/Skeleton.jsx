export default function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
}) {
  const variants = {
    text: 'h-3.5 rounded-md',
    heading: 'h-7 rounded-lg',
    rectangle: 'rounded-xl',
    circle: 'rounded-full aspect-square',
  };

  const style = {
    width,
    height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`flex w-full flex-col gap-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="skeleton-shimmer h-3.5 rounded-md"
            style={{ width: index === lines - 1 ? '72%' : width || '100%', height }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={`skeleton-shimmer block ${variants[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 ${className}`} aria-hidden="true">
      <Skeleton variant="rectangle" height="11rem" className="w-full" />
      <div className="mt-5 flex flex-col gap-3">
        <Skeleton variant="heading" className="w-2/3" />
        <Skeleton lines={2} />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton variant="heading" className="w-1/4" />
          <Skeleton variant="rectangle" height="2.25rem" className="w-1/3" />
        </div>
      </div>
    </div>
  );
}
