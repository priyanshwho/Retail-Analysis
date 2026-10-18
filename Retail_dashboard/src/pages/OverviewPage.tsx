import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingBag,
  Package,
  Store,
  Layers,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { DashboardOverview } from '../types';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/ui/ChartCard';

interface OverviewPageProps {
  data: DashboardOverview;
}

const CHANNEL_COLORS = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899'];

export const OverviewPage: React.FC<OverviewPageProps> = ({ data }) => {
  const { kpis, sales_trend, channels, top_stores, top_categories } = data;

  const formatNumber = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Revenue"
          value={formatNumber(kpis.total_revenue)}
          subtitle="Sum of sales total_value across all stores"
          icon={DollarSign}
          color="indigo"
          badge="+28.8% Margin"
        />
        <KPICard
          title="Gross Profit"
          value={formatNumber(kpis.total_profit)}
          subtitle="Calculated as total_value - (qty * cost_price)"
          icon={TrendingUp}
          color="emerald"
        />
        <KPICard
          title="Profit Margin"
          value={`${kpis.profit_margin_pct}%`}
          subtitle="Overall net profitability ratio"
          icon={Percent}
          color="cyan"
        />
        <KPICard
          title="Total Transactions"
          value={kpis.total_orders.toLocaleString()}
          subtitle="Processed sale ledger transactions"
          icon={ShoppingBag}
          color="purple"
        />
      </div>

      {/* Secondary Operational KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Units Sold</div>
            <div className="text-lg font-bold text-white">{formatNumber(kpis.total_units_sold)}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Stores</div>
            <div className="text-lg font-bold text-white">{kpis.active_stores} Stores</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Catalog SKUs</div>
            <div className="text-lg font-bold text-white">{kpis.total_skus} Products</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Stock Alerts</div>
            <div className="text-lg font-bold text-white">{kpis.low_stock_alerts} Critical</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Profit Timeline */}
        <ChartCard
          title="Revenue & Profit Trajectory"
          subtitle="Monthly historical performance across all channels"
          className="lg:col-span-2"
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sales_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: unknown) => [Number(val).toLocaleString(), '']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProf)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Channel Share */}
        <ChartCard
          title="Channel Distribution"
          subtitle="Revenue contribution by sales channel"
        >
          <div className="h-80 w-full flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={channels}
                  dataKey="revenue"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {channels.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: unknown) => [Number(val).toLocaleString(), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs">
              {channels.map((ch, idx) => (
                <div key={ch.channel} className="flex items-center justify-between px-2 py-1 rounded bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CHANNEL_COLORS[idx % CHANNEL_COLORS.length] }}
                    />
                    <span className="text-slate-300 font-medium">{ch.channel}</span>
                  </div>
                  <span className="text-slate-400">{ch.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Top Performers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stores */}
        <ChartCard
          title="Top 5 Performing Stores"
          subtitle="Highest revenue generating locations"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Store</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-right">Profit</th>
                  <th className="pb-3 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {top_stores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-medium text-slate-200">{store.name}</td>
                    <td className="py-3 text-right font-mono text-slate-200">
                      {store.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400">
                      {store.profit.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-indigo-400 font-semibold">
                      {store.margin_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Top Categories */}
        <ChartCard
          title="Top 5 Revenue Categories"
          subtitle="Core merchandise category revenue & margins"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-right">Profit</th>
                  <th className="pb-3 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {top_categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-medium text-slate-200">{cat.name}</td>
                    <td className="py-3 text-right font-mono text-slate-200">
                      {cat.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400">
                      {cat.profit.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-cyan-400 font-semibold">
                      {cat.margin_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
