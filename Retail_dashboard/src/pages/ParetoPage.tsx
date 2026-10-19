import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Award, Zap, Layers } from 'lucide-react';
import { api } from '../services/api';
import type { ParetoResponse, ActiveFilters } from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { ParetoSkeleton } from '../components/ui/Skeleton';
import { useTheme } from '../context/useTheme';

interface ParetoPageProps {
  filters: ActiveFilters;
}

export const ParetoPage: React.FC<ParetoPageProps> = ({ filters }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [data, setData] = useState<ParetoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getPareto(filters)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load Pareto data', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (loading || !data) {
    return <ParetoSkeleton />;
  }

  const chartData = data.items.map((item, index) => ({
    rank: index + 1,
    name: item.sku_name,
    revenue: item.revenue,
    cumPct: item.cumulative_percentage,
  }));

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Pareto Principle Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-indigo-200 dark:border-[#4F46E5]/30 bg-indigo-50/70 dark:bg-[#4F46E5]/10">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" /> Vital Few Catalog Drivers
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-[#F1F3F7]">
            {data.top_80_skus_count}{' '}
            <span className="text-sm font-semibold text-slate-600 dark:text-[#6C7693]">
              / {data.total_skus} SKUs
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6C7693] mt-2 font-medium">
            Just <span className="text-indigo-700 dark:text-indigo-400 font-bold">{data.top_80_skus_percentage}%</span> of catalog products generate 80% of total commercial revenue.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634]">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" /> Total Evaluated Revenue
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-[#F1F3F7] font-mono">
            {data.total_revenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6C7693] mt-2 font-medium">
            Aggregated gross value across {data.total_skus} catalog items.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634]">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" /> Long Tail SKUs
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-[#F1F3F7]">
            {data.total_skus - data.top_80_skus_count}{' '}
            <span className="text-sm font-semibold text-slate-600 dark:text-[#6C7693]">SKUs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6C7693] mt-2 font-medium">
            Remaining long-tail products drive only the final 20% of revenue.
          </p>
        </div>
      </div>

      {/* Cumulative Pareto Curve */}
      <ChartCard
        title="Pareto Cumulative Revenue Distribution Curve"
        subtitle="SKUs ordered by revenue descending with cumulative percentage share (80% cut-off line)"
      >
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="rank"
                stroke={axisColor}
                tick={{ fontSize: 11 }}
                label={{ value: 'SKU Revenue Rank (1 to 200)', position: 'insideBottom', offset: -10, fill: axisColor, fontSize: 11 }}
              />
              <YAxis
                stroke={axisColor}
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: unknown, name: unknown) => [
                  String(name) === 'Cumulative %' ? `${val}%` : Number(val).toLocaleString(),
                  String(name),
                ]}
              />
              <ReferenceLine y={80} stroke="#F43F5E" strokeDasharray="4 4" strokeWidth={2} label={{ value: '80% Revenue Threshold', fill: '#F43F5E', fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="cumPct"
                name="Cumulative %"
                stroke={focalAccent}
                fill={focalAccent}
                fillOpacity={0.15}
                strokeWidth={2.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Ranked SKUs Table */}
      <ChartCard
        title="Catalog SKU Revenue Contribution"
        subtitle="Ranked ledger of products showing cumulative revenue share"
      >
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#F0F4F8] dark:bg-[#090A0F] border-b border-[#D9E3EE] dark:border-[#222634] text-slate-700 dark:text-[#6C7693] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-2">Rank</th>
                <th className="py-3">SKU Name</th>
                <th className="py-3">Category</th>
                <th className="py-3 text-right">Revenue</th>
                <th className="py-3 text-right">Cumulative Rev</th>
                <th className="py-3 text-right">Cumulative %</th>
                <th className="py-3 text-center px-2">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222634]">
              {data.items.map((sku, idx) => (
                <tr key={sku.sku_id} className="hover:bg-[#EBF2F7] dark:hover:bg-[#090A0F]/60 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">#{idx + 1}</td>
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-[#F1F3F7] whitespace-nowrap">{sku.sku_name}</td>
                  <td className="py-2.5 text-slate-700 dark:text-[#F1F3F7] whitespace-nowrap">
                    <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#E2ECF5] border border-[#CBDCEB] dark:bg-[#14161F] dark:border-[#222634] text-slate-800 dark:text-[#F1F3F7] text-[10px] font-medium">
                      {sku.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-[#F1F3F7] whitespace-nowrap">
                    {sku.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">
                    {sku.cumulative_revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-indigo-600 dark:text-[#4F46E5] font-bold whitespace-nowrap">
                    {sku.cumulative_percentage}%
                  </td>
                  <td className="py-2.5 text-center px-2 whitespace-nowrap">
                    {sku.is_top_80 ? (
                      <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 text-[10px] font-bold">
                        Top 80% Driver
                      </span>
                    ) : (
                      <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#14161F] dark:text-[#6C7693] dark:border-[#222634] text-[10px] font-medium">
                        Long Tail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};
