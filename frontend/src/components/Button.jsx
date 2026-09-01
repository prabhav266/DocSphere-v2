import React from 'react';
import { cn } from '../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', as: Component = 'button', ...props }, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-xs hover:shadow-md border border-primary-500/20',
    secondary: 'bg-app-surface text-app-text border border-app-border hover:bg-app-surface-muted hover:border-primary-500/30 shadow-2xs',
    ghost: 'bg-transparent hover:bg-app-surface-muted text-app-text',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs border border-rose-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-bold',
    md: 'px-4 py-2 text-sm rounded-xl font-bold',
    lg: 'px-6 py-3 text-base rounded-2xl font-bold',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export default Button;
