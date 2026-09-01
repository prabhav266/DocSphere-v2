import React from 'react';
import { cn } from '../utils/cn';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-app-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-app-border bg-app-surface px-3.5 py-2 text-xs text-app-text transition-all duration-200 placeholder:text-app-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-rose-500 focus-visible:ring-rose-500/20 focus-visible:border-rose-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-semibold text-rose-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
