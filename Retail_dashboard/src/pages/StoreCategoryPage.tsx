import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import type {
  CategoryPerformanceItem,
  StorePerformanceItem,
  CityComparisonItem,
  StoreTypeComparisonItem,
  ActiveFilters,
} from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { LoadingState } from '../components/ui/LoadingState';
import { useTheme } from '../context/useTheme';

interface StoreCategoryPageProps {
  filters: ActiveFilters;
}

export const StoreCategoryPage: React.FC<StoreCategoryPageProps> = ({ filters }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [categories, setCategories] = useState<CategoryPerformanceItem[]>([]);
  const [storeData, setStoreData] = useState<{
    stores: StorePerformanceItem[];
    cities: CityComparisonItem[];
    store_types: StoreTypeComparisonItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([api.getCategoryPerformance(filters), api.getStorePerformance(filters)])
      .then(([catRes, stRes]) => {
        if (isMounted) {
          setCategories(catRes);
          setStoreData(stRes);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load store and category data', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (loading || !storeData) {
    return <LoadingState message="Loading store & category analytics..." />;
  }

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#cbdceb',
    borderRadius: '12px',
    fontSize: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(15,23,42,0.1)',
  };

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const axisColor = isDark ? '#94a3b8' : '#475569';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Charts: City Margin Matrix + Store Format Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Margin Performance */}
        <ChartCard
          title="Top Metros Revenue & Profit"
          subtitle="Top performing cities by gross sales and margin percentage"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeData.cities} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="city" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: unknown) => [Number(val).toLocaleString(), '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#D9E3EE] dark:border-slate-800 text-xs">
            {storeData.cities.map((c) => (
              <div key={c.city} className="p-2.5 rounded-xl bg-[#EAF0F6] dark:bg-slate-950/60 border border-[#CBDCEB] dark:border-slate-800/80">
                <div className="font-bold text-slate-800 dark:text-slate-200">{c.city}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{c.store_count} Stores</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">{c.margin_pct}% Margin</div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Store Type Format */}
        <ChartCard
          title="Store Format Benchmark"
          subtitle="Comparison of Mall, High Street, and Community locations"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeData.store_types} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="store_type" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: unknown) => [Number(val).toLocaleString(), '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#D9E3EE] dark:border-slate-800 text-xs">
            {storeData.store_types.map((t) => (
              <div key={t.store_type} className="p-2.5 rounded-xl bg-[#EAF0F6] dark:bg-slate-950/60 border border-[#CBDCEB] dark:border-slate-800/80">
                <div className="font-bold text-slate-800 dark:text-slate-200">{t.store_type}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{t.store_count} Stores</div>
                <div className="text-cyan-700 dark:text-cyan-400 font-mono font-bold mt-1">{t.margin_pct}% Margin</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Category Performance Breakdown */}
      <ChartCard
        title="Merchandise Category Performance"
        subtitle="Revenue, gross profit, and margin ranking by product category"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9E3EE] dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">SKUs</th>
                <th className="pb-3 text-right">Units Sold</th>
                <th className="pb-3 text-right">Revenue</th>
                <th className="pb-3 text-right">Gross Profit</th>
                <th className="pb-3 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800/60">
              {categories.map((cat) => (
                <tr key={cat.category} className="hover:bg-[#EBF2F7] dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{cat.category}</td>
                  <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-400">{cat.skus_count}</td>
                  <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {cat.units.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    {cat.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {cat.profit.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {cat.margin_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* All Stores Leaderboard */}
      <ChartCard
        title="Store Rankings Directory (All 50 Locations)"
        subtitle="Full operational performance by individual store"
      >
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#F0F4F8] dark:bg-slate-900 border-b border-[#D9E3EE] dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-2">Store ID</th>
                <th className="py-3">Store Name</th>
                <th className="py-3">City</th>
                <th className="py-3">Format</th>
                <th className="py-3 text-right">Orders</th>
                <th className="py-3 text-right">Revenue</th>
                <th className="py-3 text-right">Profit</th>
                <th className="py-3 text-right px-2">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800/60">
              {storeData.stores.map((s) => (
                <tr key={s.store_id} className="hover:bg-[#EBF2F7] dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-slate-400">#{s.store_id}</td>
                  <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{s.store_name}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-[#E2ECF5] border border-[#CBDCEB] text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 text-[10px] font-medium">
                      {s.city}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 font-medium">{s.store_type}</td>
                  <td className="py-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {s.orders.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-900 dark:text-slate-100 font-bold">
                    {s.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {s.profit.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right px-2 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {s.margin_pct}%
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
