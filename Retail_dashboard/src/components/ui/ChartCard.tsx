import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`glass-panel rounded-2xl p-6 border border-[#DCE5EF] dark:border-[#222634] shadow-md dark:shadow-lg ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F3F7] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-600 dark:text-[#6C7693] mt-0.5 font-medium">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
