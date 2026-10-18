import React from 'react';
import { Calendar, MapPin, Tag, ShoppingCart, Store, RotateCcw } from 'lucide-react';
import type { FilterOptions, ActiveFilters } from '../../types';

interface FilterBarProps {
  options: FilterOptions | null;
  filters: ActiveFilters;
  onFilterChange: (key: keyof ActiveFilters, value: string | number | undefined) => void;
  onReset: () => void;
  isOpen: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  filters,
  onFilterChange,
  onReset,
  isOpen,
}) => {
  if (!isOpen) return null;

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="bg-[#F4F1EA]/95 dark:bg-slate-900/90 border-b border-[#E2DDD2] dark:border-slate-800 p-5 backdrop-blur-md transition-all animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            Global Analytics Filters
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            (Applies across all aggregated charts and KPI metrics)
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* City Filter */}
        <div>
          <label htmlFor="filter-city" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" /> City
          </label>
          <select
            id="filter-city"
            value={filters.city || ''}
            onChange={(e) => onFilterChange('city', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          >
            <option value="">All Cities</option>
            {options?.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Store Type Filter */}
        <div>
          <label htmlFor="filter-store-type" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Store className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Store Type
          </label>
          <select
            id="filter-store-type"
            value={filters.store_type || ''}
            onChange={(e) => onFilterChange('store_type', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          >
            <option value="">All Formats</option>
            {options?.store_types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="filter-category" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Category
          </label>
          <select
            id="filter-category"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          >
            <option value="">All Categories</option>
            {options?.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label htmlFor="filter-channel" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <ShoppingCart className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Channel
          </label>
          <select
            id="filter-channel"
            value={filters.channel || ''}
            onChange={(e) => onFilterChange('channel', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          >
            <option value="">All Channels</option>
            {options?.channels.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="filter-start-date" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" /> From Date
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={filters.start_date || ''}
            min={options?.date_range.min}
            max={options?.date_range.max}
            onChange={(e) => onFilterChange('start_date', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="filter-end-date" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" /> To Date
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={filters.end_date || ''}
            min={options?.date_range.min}
            max={options?.date_range.max}
            onChange={(e) => onFilterChange('end_date', e.target.value || undefined)}
            className="w-full bg-white dark:bg-slate-950 border border-[#DDD6C8] dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </div>
  );
};
