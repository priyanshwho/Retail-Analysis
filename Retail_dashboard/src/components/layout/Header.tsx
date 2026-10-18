import React from 'react';
import { RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import type { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onRefresh: () => void;
  isLoading: boolean;
  filterCount: number;
  toggleFilterBar: () => void;
  showFilters: boolean;
}

const titles: Record<NavTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive Performance Dashboard',
    subtitle: 'High-level retail KPIs, revenue metrics, and channel distribution across 50 stores',
  },
  sales: {
    title: 'Sales & Revenue Intelligence',
    subtitle: 'Granular seasonality trends, transaction volumes, and promotional discount impact',
  },
  stores: {
    title: 'Store & Category Benchmarks',
    subtitle: 'Regional retail performance across Dubai, Abu Dhabi, and Sharjah',
  },
  risk: {
    title: 'Inventory & Profit Risk Engine',
    subtitle: 'Algorithmic detection of stockout hazards, reorder thresholds, and margin leaks',
  },
  pareto: {
    title: 'Pareto 80/20 Catalog Analysis',
    subtitle: 'Identifying the vital 20% of SKUs generating 80% of total revenue',
  },
  explorer: {
    title: 'Granular Data Explorer',
    subtitle: 'Searchable ledger of 641,000+ sales transactions and live inventory snapshots',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onRefresh,
  isLoading,
  filterCount,
  toggleFilterBar,
  showFilters,
}) => {
  const current = titles[activeTab] || titles.overview;

  return (
    <header className="h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          {current.title}
          <span className="flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Verified Data
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Filter Toggle Button */}
        <button
          onClick={toggleFilterBar}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            showFilters || filterCount > 0
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/80'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {filterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
              {filterCount}
            </span>
          )}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/80 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
};
