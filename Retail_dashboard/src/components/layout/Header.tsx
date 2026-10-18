import React from 'react';
import { RefreshCw, Filter, ShieldCheck, Menu } from 'lucide-react';
import type { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onRefresh: () => void;
  isLoading: boolean;
  filterCount: number;
  toggleFilterBar: () => void;
  showFilters: boolean;
  onOpenMobileNav: () => void;
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
  onOpenMobileNav,
}) => {
  const current = titles[activeTab] || titles.overview;

  return (
    <header className="h-20 bg-[#F8F6F0]/85 dark:bg-slate-900/60 backdrop-blur-md border-b border-[#E5DFD4] dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Mobile Navigation Trigger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-[#EFEAE0] dark:bg-slate-800 border border-[#DDD6C8] dark:border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            {current.title}
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Verified Data
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Filter Toggle Button */}
        <button
          onClick={toggleFilterBar}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            showFilters || filterCount > 0
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/30 dark:text-indigo-300 dark:border-indigo-500/50 shadow-sm'
              : 'bg-[#EFEAE0] text-slate-700 hover:text-slate-900 hover:bg-[#E5DFD5] border border-[#DDD6C8] dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:border-slate-700/80'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
          {filterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              {filterCount}
            </span>
          )}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#EFEAE0] text-slate-700 hover:text-slate-900 hover:bg-[#E5DFD5] border border-[#DDD6C8] dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/80 dark:border-slate-700/80 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
      </div>
    </header>
  );
};
