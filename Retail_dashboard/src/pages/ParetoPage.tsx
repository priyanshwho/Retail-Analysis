import React, { useState, useEffect } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { Award, Zap, Layers } from 'lucide-react';
import { api } from '../services/api';
import type { ParetoResponse, ActiveFilters } from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { LoadingState } from '../components/ui/LoadingState';

interface ParetoPageProps {
  filters: ActiveFilters;
}

export const ParetoPage: React.FC<ParetoPageProps> = ({ filters }) => {
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
    return <LoadingState message="Calculating 80/20 cumulative revenue distribution..." />;
  }

  const chartData = data.items.map((item, index) => ({
    rank: index + 1,
    name: item.sku_name,
    revenue: item.revenue,
    cumPct: item.cumulative_percentage,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Pareto Principle Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" /> Vital Few Catalog Drivers
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data.top_80_skus_count}{' '}
            <span className="text-sm font-normal text-slate-400">
              / {data.total_skus} SKUs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Just <span className="text-indigo-300 font-bold">{data.top_80_skus_percentage}%</span> of catalog products generate 80% of total commercial revenue.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" /> Total Evaluated Revenue
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {data.total_revenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Aggregated gross value across {data.total_skus} catalog items.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" /> Long Tail SKUs
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data.total_skus - data.top_80_skus_count}{' '}
            <span className="text-sm font-normal text-slate-400">SKUs</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="rank"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{ value: 'SKU Revenue Rank (1 to 200)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [
                  name === 'Cumulative %' ? `${val}%` : Number(val).toLocaleString(),
                  name,
                ]}
              />
              <ReferenceLine y={80} stroke="#f43f5e" strokeDasharray="4 4" strokeWidth={2} label={{ value: '80% Revenue Threshold', fill: '#f43f5e', fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="cumPct"
                name="Cumulative %"
                stroke="#6366f1"
                fill="#6366f1"
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
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
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
            <tbody className="divide-y divide-slate-800/60">
              {data.items.map((sku, idx) => (
                <tr key={sku.sku_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-400">#{idx + 1}</td>
                  <td className="py-2.5 font-semibold text-slate-200">{sku.sku_name}</td>
                  <td className="py-2.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px]">
                      {sku.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-medium text-slate-200">
                    {sku.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-400">
                    {sku.cumulative_revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-indigo-400 font-bold">
                    {sku.cumulative_percentage}%
                  </td>
                  <td className="py-2.5 text-center px-2">
                    {sku.is_top_80 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        Top 80% Driver
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
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
