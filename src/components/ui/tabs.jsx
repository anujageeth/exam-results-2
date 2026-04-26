import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className }) => (
  <div className={cn(
    'inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1',
    className
  )}>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return null;
      return React.cloneElement(child, { activeTab, setActiveTab });
    })}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
      activeTab === value
        ? 'bg-white text-ceylon-maroon shadow-sm'
        : 'text-gray-500 hover:text-gray-700',
      className
    )}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className }) => {
  if (activeTab !== value) return null;
  return (
    <div className={cn('mt-4 animate-fade-in', className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
