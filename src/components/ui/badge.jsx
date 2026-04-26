import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  pass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  fail: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  published: 'bg-blue-50 text-blue-700 border-blue-200',
  maroon: 'bg-ceylon-maroon-50 text-ceylon-maroon border-ceylon-maroon-100',
  gold: 'bg-ceylon-gold-50 text-ceylon-gold-700 border-ceylon-gold-200',
};

const Badge = ({ className, variant = 'default', children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge, badgeVariants };
