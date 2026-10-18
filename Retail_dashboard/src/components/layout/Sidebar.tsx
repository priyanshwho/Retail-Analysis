import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  AlertTriangle,
  PieChart,
  Database,
  Layers,
  ChevronRight,
  DatabaseZap,
} from 'lucide-react';

export type NavTab = 'overview' | 'sales' | 'stores' | 'risk' | 'pareto' | 'explorer';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  healthConnected: boolean;
  totalRows?: number;
}

const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales & Trends', icon: TrendingUp },
  { id: 'stores', label: 'Stores & Categories', icon: Store },
  { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle, badge: 'Crucial' },
  { id: 'pareto', label: 'Pareto (80/20)', icon: PieChart },
  { id: 'explorer', label: 'Data Explorer', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  healthConnected,
  totalRows = 641843,
}) => {
  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              BlueMart
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium">
                BI
              </span>
            </h1>
            <p className="text-xs text-slate-400">Retail Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Analytics Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700/80 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Neon DB Live Status Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <DatabaseZap className="w-3.5 h-3.5 text-cyan-400" />
            Neon PostgreSQL
          </div>
          <span className="flex items-center gap-1.5 text-[10px]">
            <span
              className={`w-2 h-2 rounded-full ${
                healthConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className={healthConnected ? 'text-emerald-400' : 'text-rose-400'}>
              {healthConnected ? 'Live' : 'Offline'}
            </span>
          </span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>Branch</span>
            <span className="font-mono text-slate-300">production</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Records</span>
            <span className="font-mono text-slate-300">{totalRows.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
