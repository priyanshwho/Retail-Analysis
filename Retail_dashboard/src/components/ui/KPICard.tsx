import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  badge?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
}

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    glow: 'hover:border-indigo-400/50 dark:group-hover:border-indigo-500/40',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glow: 'hover:border-emerald-400/50 dark:group-hover:border-emerald-500/40',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    glow: 'hover:border-amber-400/50 dark:group-hover:border-amber-500/40',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-200 dark:border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    glow: 'hover:border-rose-400/50 dark:group-hover:border-rose-500/40',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    iconColor: 'text-cyan-700 dark:text-cyan-400',
    glow: 'hover:border-cyan-400/50 dark:group-hover:border-cyan-500/40',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    glow: 'hover:border-purple-400/50 dark:group-hover:border-purple-500/40',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = 'indigo',
}) => {
  const c = colorStyles[color];

  return (
    <div className={`group glass-panel rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shadow-xs`}>
          <Icon className={`w-4 h-4 ${c.iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EFEAE0] text-slate-700 border border-[#DDD6C8] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
