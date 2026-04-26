import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, className }) => {
  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    down: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    neutral: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-100' },
  };

  const trendData = trend ? trendConfig[trend] : null;
  const TrendIcon = trendData?.icon;

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 p-6 shadow-card hover:shadow-card-hover transition-all duration-300',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-ceylon-maroon-50">
            <Icon className="h-5 w-5 text-ceylon-maroon" />
          </div>
        )}
      </div>
      {trendData && trendValue && (
        <div className="flex items-center gap-1.5 mt-3">
          <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium', trendData.bg, trendData.color)}>
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </div>
          <span className="text-xs text-gray-400">vs last semester</span>
        </div>
      )}
    </div>
  );
};

export { StatCard };
