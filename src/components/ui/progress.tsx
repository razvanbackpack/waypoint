import * as React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  shimmer?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, shimmer = false, className = '', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary/50 ${className}`}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary shadow-sm shadow-primary/30 transition-all duration-500 ${shimmer ? 'bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]' : ''}`}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
