import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import type { SalesTrendPoint, ActiveFilters } from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { SalesAnalyticsSkeleton } from '../components/ui/Skeleton';
import { useTheme } from '../context/useTheme';

interface SalesAnalyticsPageProps {
  filters: ActiveFilters;
}

export const SalesAnalyticsPage: React.FC<SalesAnalyticsPageProps> = ({ filters }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [data, setData] = useState<SalesTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getSalesTrend(granularity, filters)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load sales trend', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [granularity, filters]);

  if (loading) return <SalesAnalyticsSkeleton />;

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = data.reduce((acc, curr) => acc + curr.profit, 0);
  const totalUnits = data.reduce((acc, curr) => acc + curr.units, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  const tooltipStyle = {
    backgroundColor: isDark ? '#14161F' : '#ffffff',
    borderColor: isDark ? '#222634' : '#cbdceb',
    borderRadius: '12px',
    fontSize: '12px',
    color: isDark ? '#F1F3F7' : '#0f172a',
    boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.7)' : '0 10px 25px -5px rgba(15,23,42,0.1)',
  };

  const gridColor = isDark ? '#222634' : '#e2e8f0';
  const axisColor = isDark ? '#6C7693' : '#475569';
  const focalAccent = isDark ? '#4F46E5' : '#2563EB';
  const supportingAccent = isDark ? '#0ea5e9' : '#10b981';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top summary banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-[#4F46E5]">
            Timeline Summary
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#F1F3F7] mt-1">
            {data.length} {granularity.toUpperCase()} Data Points Recorded
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#6C7693] mt-1 font-medium">
            Revenue: <span className="text-slate-900 dark:text-[#F1F3F7] font-mono font-bold">{totalRevenue.toLocaleString()}</span> • Gross Profit: <span className="text-emerald-600 dark:text-[#0ea5e9] font-mono font-bold">{totalProfit.toLocaleString()}</span> ({avgMargin}% Margin) • Units: <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">{totalUnits.toLocaleString()}</span> • Transactions: <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">{totalOrders.toLocaleString()}</span>
          </p>
        </div>

        {/* Granularity Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E2ECF5] dark:bg-[#090A0F] rounded-xl border border-[#CBDCEB] dark:border-[#222634]">
          {(['month', 'week', 'day', 'year'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                granularity === g
                  ? (isDark ? 'bg-[#4F46E5] text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm')
                  : 'text-slate-700 hover:text-slate-950 hover:bg-[#D4E3F0] dark:text-[#6C7693] dark:hover:text-[#F1F3F7] dark:hover:bg-[#14161F]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Revenue & Profit Chart */}
      <ChartCard
        title="Revenue & Profit Progression"
        subtitle={`Aggregated sales values grouped by ${granularity}`}
      >
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                tick={{ fontSize: 11 }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                stroke={axisColor}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => {
                  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
                  return String(val);
                }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: unknown, name: unknown) => [Number(val).toLocaleString(), String(name)]}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Total Revenue" fill={focalAccent} radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="profit"
                name="Gross Profit"
                stroke={supportingAccent}
                strokeWidth={3}
                dot={{ r: 3, fill: supportingAccent }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Unit Sales & Transaction Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Units Sold Volume"
          subtitle="Total item units sold per period"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="units" name="Units Sold" fill={supportingAccent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Transaction Order Count"
          subtitle="Number of individual sales entries"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="orders" name="Transactions" fill={focalAccent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
