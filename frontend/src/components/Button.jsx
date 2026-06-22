import React from 'react';
import { cn } from '../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', as: Component = 'button', ...props }, ref) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
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
