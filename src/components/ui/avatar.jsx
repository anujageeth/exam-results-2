import React from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

const Avatar = ({ name, size = 'md', className }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div className={cn(
      'inline-flex items-center justify-center rounded-full bg-ceylon-maroon-100 text-ceylon-maroon font-semibold',
      sizes[size],
      className
    )}>
      {name ? initials : <User className="h-4 w-4" />}
    </div>
  );
};

export { Avatar };
