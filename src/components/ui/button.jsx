import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: 'bg-ceylon-maroon text-white hover:bg-ceylon-maroon-600 shadow-sm',
  gold: 'bg-ceylon-gold text-ceylon-maroon-800 hover:bg-ceylon-gold-500 shadow-sm font-semibold',
  outline: 'border-2 border-ceylon-maroon text-ceylon-maroon hover:bg-ceylon-maroon hover:text-white',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-10 px-5 text-sm rounded-lg',
  lg: 'h-12 px-8 text-base rounded-lg',
  icon: 'h-10 w-10 rounded-lg',
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'md', 
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ceylon-maroon/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
