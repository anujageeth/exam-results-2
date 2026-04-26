import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, id, type = 'text', ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ceylon-maroon/20 focus:border-ceylon-maroon',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
