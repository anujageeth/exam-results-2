import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const Dialog = ({ open, onClose, children, className }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Content */}
      <div className={cn(
        'relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto mx-4',
        'bg-white rounded-xl shadow-elevated border border-gray-200',
        'animate-slide-up',
        className
      )}>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ className, children, onClose, ...props }) => (
  <div className={cn('flex items-center justify-between p-6 pb-3', className)} {...props}>
    <div>{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-gray-900', className)} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-gray-500 mt-1', className)} {...props} />
);

const DialogContent = ({ className, ...props }) => (
  <div className={cn('px-6 py-3', className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-end gap-3 p-6 pt-3', className)} {...props} />
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter };
