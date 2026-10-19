import React from 'react';
import type { NavTab } from '../layout/Sidebar';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Base atomic Skeleton component with smooth shimmer animation
 * styled for both Light and Dark themes.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'md',
  ...props
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`skeleton-base skeleton-shimmer ${roundedClass} ${className}`}
      {...props}
    />
  );
};

/**
 * Exact shape and size skeleton for KPICard
 */
export const KPICardSkeleton: React.FC<{ hasBadge?: boolean; subtitleWidth?: string }> = ({
  hasBadge = false,
  subtitleWidth = 'w-44',
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-[#DCE5EF] dark:border-[#222634] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3.5 w-24 rounded-md" />
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <Skeleton className="h-7 w-28 rounded-lg" />
        {hasBadge && <Skeleton className="h-5 w-20 rounded-full" />}
      </div>

      <Skeleton className={`h-3 ${subtitleWidth} max-w-full rounded mt-2`} />
    </div>
  );
};

/**
 * Exact shape and size skeleton for ChartCard container
 */
export const ChartCardSkeleton: React.FC<{
  titleWidth?: string;
  subtitleWidth?: string;
  children: React.ReactNode;
  className?: string;
  hasAction?: boolean;
}> = ({
  titleWidth = 'w-48',
  subtitleWidth = 'w-64',
  children,
  className = '',
  hasAction = false,
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 border border-[#DCE5EF] dark:border-[#222634] shadow-md dark:shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <Skeleton className={`h-5 ${titleWidth} rounded-md`} />
          <Skeleton className={`h-3 ${subtitleWidth} rounded mt-2`} />
        </div>
        {hasAction && <Skeleton className="h-8 w-28 rounded-lg" />}
      </div>
      <div>{children}</div>
    </div>
  );
};

/**
 * Exact skeleton for Area Chart (used in Overview & Pareto)
 */
export const AreaChartSkeleton: React.FC<{ heightClass?: string }> = ({
  heightClass = 'h-80',
}) => {
  return (
    <div className={`${heightClass} w-full flex flex-col justify-between py-2 relative overflow-hidden`}>
      {/* Background horizontal grid lines */}
      <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none opacity-40">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-dashed border-slate-300 dark:border-slate-800 w-full" />
        ))}
      </div>

      {/* Simulated Chart Plot Area */}
      <div className="flex-1 flex items-end justify-between gap-2 px-6 pt-4 pb-2 z-10">
        {[42, 60, 52, 75, 68, 85, 78, 92, 80, 88, 95, 84].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              style={{ height: `${height}%` }}
              className="w-full rounded-t-md bg-gradient-to-t from-blue-500/10 via-indigo-500/20 to-indigo-500/30 dark:from-indigo-600/10 dark:via-indigo-500/20 dark:to-[#4F46E5]/40 skeleton-shimmer relative"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500/60 dark:bg-indigo-400" />
            </div>
            {/* X-axis date tick skeleton */}
            <Skeleton className="h-2.5 w-6 rounded-sm mt-1" />
          </div>
        ))}
      </div>

      {/* Axis baseline */}
      <div className="h-px bg-slate-300 dark:bg-[#222634] w-full" />
    </div>
  );
};

/**
 * Exact skeleton for Donut / Pie Chart & Channel Breakdown
 */
export const DonutChartSkeleton: React.FC = () => {
  return (
    <div className="h-80 w-full flex flex-col justify-center">
      {/* Donut Ring */}
      <div className="relative w-44 h-44 mx-auto my-auto flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-[20px] border-[#CBDCEB]/60 dark:border-[#1E2333] skeleton-shimmer relative">
          <div className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-indigo-400/40 dark:border-t-indigo-500/50" />
        </div>
        <div className="absolute flex flex-col items-center justify-center">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-2.5 w-8 rounded mt-1 opacity-70" />
        </div>
      </div>

      {/* 2x2 Channel Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#D9E3EE] dark:border-[#222634]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#EAF0F6] dark:bg-[#090A0F] border border-[#CBDCEB] dark:border-[#222634]"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
            <Skeleton className="h-3 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Multi-column or Grouped Bar Chart Skeleton
 */
export const BarChartSkeleton: React.FC<{
  heightClass?: string;
  barsCount?: number;
  isGrouped?: boolean;
}> = ({ heightClass = 'h-72', barsCount = 8, isGrouped = false }) => {
  const heights = [45, 78, 62, 90, 54, 82, 69, 95, 60, 85, 72, 88];

  return (
    <div className={`${heightClass} w-full flex flex-col justify-between py-2 relative`}>
      {/* Grid lines */}
      <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none opacity-40">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-b border-dashed border-slate-300 dark:border-slate-800 w-full" />
        ))}
      </div>

      <div className="flex-1 flex items-end justify-between gap-3 px-4 pt-4 pb-2 z-10">
        {[...Array(barsCount)].map((_, i) => {
          const h1 = heights[i % heights.length];
          const h2 = Math.max(30, h1 - 20);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div
                  style={{ height: `${h1}%` }}
                  className="w-full max-w-[24px] rounded-t-md bg-blue-500/25 dark:bg-[#4F46E5]/35 skeleton-shimmer"
                />
                {isGrouped && (
                  <div
                    style={{ height: `${h2}%` }}
                    className="w-full max-w-[24px] rounded-t-md bg-emerald-500/25 dark:bg-[#0ea5e9]/35 skeleton-shimmer"
                  />
                )}
              </div>
              <Skeleton className="h-2.5 w-7 rounded-sm mt-1" />
            </div>
          );
        })}
      </div>

      <div className="h-px bg-slate-300 dark:bg-[#222634] w-full" />
    </div>
  );
};

/**
 * Generic Table Skeleton with customizable columns and rows
 */
export const TableSkeleton: React.FC<{
  columns: { nameWidth: string; align?: 'left' | 'right' | 'center' }[];
  rows?: number;
  rowHeight?: string;
}> = ({ columns, rows = 5, rowHeight = 'py-3' }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#D9E3EE] dark:border-[#222634]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`pb-3 ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block ${
                    col.align === 'right' ? 'ml-auto' : col.align === 'center' ? 'mx-auto' : ''
                  }`}
                >
                  <Skeleton className={`h-3 ${col.nameWidth} rounded`} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222634]">
          {[...Array(rows)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`${rowHeight} ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block ${
                      col.align === 'right' ? 'ml-auto' : col.align === 'center' ? 'mx-auto' : ''
                    }`}
                  >
                    <Skeleton
                      className={`h-3.5 ${
                        colIdx === 0 ? 'w-24' : colIdx === 1 ? 'w-20' : col.nameWidth
                      } rounded`}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* =========================================================================
   PAGE SKELETONS - Exact match for each Dashboard tab
   ========================================================================= */

/**
 * Executive Overview Page Skeleton
 */
export const OverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" role="status" aria-label="Loading Overview Dashboard">
      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICardSkeleton hasBadge subtitleWidth="w-52" />
        <KPICardSkeleton subtitleWidth="w-56" />
        <KPICardSkeleton subtitleWidth="w-40" />
        <KPICardSkeleton subtitleWidth="w-48" />
      </div>

      {/* Secondary Operational KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICardSkeleton subtitleWidth="w-40" />
        <KPICardSkeleton subtitleWidth="w-44" />
        <KPICardSkeleton subtitleWidth="w-48" />
        <KPICardSkeleton hasBadge subtitleWidth="w-48" />
      </div>

      {/* Main Charts Row: Area Trend (2 cols) + Channel Pie (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCardSkeleton
          titleWidth="w-56"
          subtitleWidth="w-72"
          className="lg:col-span-2"
        >
          <AreaChartSkeleton heightClass="h-80" />
        </ChartCardSkeleton>

        <ChartCardSkeleton
          titleWidth="w-44"
          subtitleWidth="w-60"
        >
          <DonutChartSkeleton />
        </ChartCardSkeleton>
      </div>

      {/* Top Performers Row: Top Stores (1 col) + Top Categories (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton titleWidth="w-52" subtitleWidth="w-64">
          <TableSkeleton
            columns={[
              { nameWidth: 'w-16', align: 'left' },
              { nameWidth: 'w-20', align: 'right' },
              { nameWidth: 'w-16', align: 'right' },
              { nameWidth: 'w-14', align: 'right' },
            ]}
            rows={5}
          />
        </ChartCardSkeleton>

        <ChartCardSkeleton titleWidth="w-52" subtitleWidth="w-68">
          <TableSkeleton
            columns={[
              { nameWidth: 'w-20', align: 'left' },
              { nameWidth: 'w-20', align: 'right' },
              { nameWidth: 'w-16', align: 'right' },
              { nameWidth: 'w-14', align: 'right' },
            ]}
            rows={5}
          />
        </ChartCardSkeleton>
      </div>
    </div>
  );
};

/**
 * Sales Analytics Page Skeleton
 */
export const SalesAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" role="status" aria-label="Loading Sales Analytics">
      {/* Top Summary Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634] flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-6 w-72 rounded-lg mt-2" />
          <Skeleton className="h-3.5 w-96 max-w-full rounded mt-2" />
        </div>

        {/* Granularity Switcher skeleton */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E2ECF5] dark:bg-[#090A0F] rounded-xl border border-[#CBDCEB] dark:border-[#222634]">
          {['Month', 'Week', 'Day', 'Year'].map((g) => (
            <Skeleton key={g} className="h-7 w-14 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Revenue & Profit Progression Composed Chart */}
      <ChartCardSkeleton titleWidth="w-60" subtitleWidth="w-72">
        <AreaChartSkeleton heightClass="h-96" />
      </ChartCardSkeleton>

      {/* Unit Sales & Transaction Order Count */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton titleWidth="w-44" subtitleWidth="w-56">
          <BarChartSkeleton heightClass="h-72" barsCount={10} />
        </ChartCardSkeleton>

        <ChartCardSkeleton titleWidth="w-48" subtitleWidth="w-56">
          <BarChartSkeleton heightClass="h-72" barsCount={10} />
        </ChartCardSkeleton>
      </div>
    </div>
  );
};

/**
 * Store & Category Page Skeleton
 */
export const StoreCategorySkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" role="status" aria-label="Loading Store & Category Data">
      {/* Top Charts: City Margin Matrix + Store Format Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton titleWidth="w-64" subtitleWidth="w-72">
          <BarChartSkeleton heightClass="h-64" barsCount={6} isGrouped />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#D9E3EE] dark:border-[#222634]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#EAF0F6] dark:bg-[#090A0F] border border-[#CBDCEB] dark:border-[#222634]"
              >
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded mt-1.5" />
                <Skeleton className="h-3.5 w-20 rounded mt-1.5" />
              </div>
            ))}
          </div>
        </ChartCardSkeleton>

        <ChartCardSkeleton titleWidth="w-56" subtitleWidth="w-72">
          <BarChartSkeleton heightClass="h-64" barsCount={6} isGrouped />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#D9E3EE] dark:border-[#222634]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#EAF0F6] dark:bg-[#090A0F] border border-[#CBDCEB] dark:border-[#222634]"
              >
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded mt-1.5" />
                <Skeleton className="h-3.5 w-20 rounded mt-1.5" />
              </div>
            ))}
          </div>
        </ChartCardSkeleton>
      </div>

      {/* Merchandise Category Performance Table */}
      <ChartCardSkeleton titleWidth="w-64" subtitleWidth="w-80">
        <TableSkeleton
          columns={[
            { nameWidth: 'w-20', align: 'left' },
            { nameWidth: 'w-12', align: 'right' },
            { nameWidth: 'w-16', align: 'right' },
            { nameWidth: 'w-20', align: 'right' },
            { nameWidth: 'w-20', align: 'right' },
            { nameWidth: 'w-16', align: 'right' },
          ]}
          rows={7}
        />
      </ChartCardSkeleton>

      {/* All Stores Leaderboard Directory Table */}
      <ChartCardSkeleton titleWidth="w-72" subtitleWidth="w-64">
        <TableSkeleton
          columns={[
            { nameWidth: 'w-14', align: 'left' },
            { nameWidth: 'w-28', align: 'left' },
            { nameWidth: 'w-16', align: 'left' },
            { nameWidth: 'w-16', align: 'left' },
            { nameWidth: 'w-14', align: 'right' },
            { nameWidth: 'w-20', align: 'right' },
            { nameWidth: 'w-18', align: 'right' },
            { nameWidth: 'w-14', align: 'right' },
          ]}
          rows={10}
        />
      </ChartCardSkeleton>
    </div>
  );
};

/**
 * Risk Analysis Page Skeleton
 */
export const RiskAnalysisSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" role="status" aria-label="Loading Risk Analysis">
      {/* Risk Quadrant KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              i === 0
                ? 'border-indigo-400/60 bg-[#E2ECF5]/80 dark:bg-[#14161F] dark:border-[#4F46E5]/60'
                : 'border-[#CBDCEB] dark:border-[#222634] dark:bg-[#14161F]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded mt-2" />
            <Skeleton className="h-3 w-3/4 rounded mt-1.5" />
          </div>
        ))}
      </div>

      {/* Explanatory Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-200 dark:border-[#4F46E5]/30 bg-indigo-50/70 dark:bg-[#4F46E5]/10 flex items-start gap-3.5">
        <Skeleton className="w-5 h-5 rounded shrink-0 mt-0.5" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
      </div>

      {/* Risk Table */}
      <ChartCardSkeleton titleWidth="w-64" subtitleWidth="w-80">
        <TableSkeleton
          columns={[
            { nameWidth: 'w-14', align: 'left' },
            { nameWidth: 'w-36', align: 'left' },
            { nameWidth: 'w-20', align: 'left' },
            { nameWidth: 'w-16', align: 'left' },
            { nameWidth: 'w-16', align: 'right' },
            { nameWidth: 'w-20', align: 'right' },
            { nameWidth: 'w-18', align: 'right' },
            { nameWidth: 'w-14', align: 'right' },
            { nameWidth: 'w-16', align: 'right' },
            { nameWidth: 'w-32', align: 'left' },
          ]}
          rows={8}
        />
      </ChartCardSkeleton>
    </div>
  );
};

/**
 * Pareto 80/20 Page Skeleton
 */
export const ParetoSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" role="status" aria-label="Loading Pareto 80/20 Analysis">
      {/* Pareto Principle Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-indigo-200 dark:border-[#4F46E5]/30 bg-indigo-50/70 dark:bg-[#4F46E5]/10">
          <Skeleton className="h-3 w-36 rounded mb-3" />
          <Skeleton className="h-8 w-32 rounded-lg mb-2" />
          <Skeleton className="h-3 w-48 rounded" />
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634]">
          <Skeleton className="h-3 w-40 rounded mb-3" />
          <Skeleton className="h-8 w-28 rounded-lg mb-2" />
          <Skeleton className="h-3 w-44 rounded" />
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#DCE5EF] dark:border-[#222634]">
          <Skeleton className="h-3 w-36 rounded mb-3" />
          <Skeleton className="h-8 w-20 rounded-lg mb-2" />
          <Skeleton className="h-3 w-44 rounded" />
        </div>
      </div>

      {/* Main Pareto Distribution Curve */}
      <ChartCardSkeleton titleWidth="w-72" subtitleWidth="w-80">
        <AreaChartSkeleton heightClass="h-80" />
      </ChartCardSkeleton>

      {/* Top 80/20 SKU Revenue Contributors */}
      <ChartCardSkeleton titleWidth="w-64" subtitleWidth="w-72">
        <TableSkeleton
          columns={[
            { nameWidth: 'w-12', align: 'left' },
            { nameWidth: 'w-36', align: 'left' },
            { nameWidth: 'w-20', align: 'left' },
            { nameWidth: 'w-16', align: 'right' },
            { nameWidth: 'w-20', align: 'right' },
            { nameWidth: 'w-16', align: 'right' },
          ]}
          rows={8}
        />
      </ChartCardSkeleton>
    </div>
  );
};

/**
 * Data Explorer Table Skeleton (for loading state inside DataExplorerPage)
 */
export const DataExplorerTableSkeleton: React.FC<{ view?: 'sales' | 'inventory' }> = ({
  view = 'sales',
}) => {
  return (
    <ChartCardSkeleton titleWidth="w-72" subtitleWidth="w-48">
      <div className="min-h-[460px]">
        <TableSkeleton
          columns={
            view === 'sales'
              ? [
                  { nameWidth: 'w-12', align: 'left' },
                  { nameWidth: 'w-16', align: 'left' },
                  { nameWidth: 'w-24', align: 'left' },
                  { nameWidth: 'w-32', align: 'left' },
                  { nameWidth: 'w-16', align: 'left' },
                  { nameWidth: 'w-12', align: 'right' },
                  { nameWidth: 'w-14', align: 'right' },
                  { nameWidth: 'w-16', align: 'right' },
                  { nameWidth: 'w-14', align: 'right' },
                  { nameWidth: 'w-16', align: 'center' },
                ]
              : [
                  { nameWidth: 'w-28', align: 'left' },
                  { nameWidth: 'w-16', align: 'left' },
                  { nameWidth: 'w-36', align: 'left' },
                  { nameWidth: 'w-20', align: 'left' },
                  { nameWidth: 'w-16', align: 'right' },
                  { nameWidth: 'w-16', align: 'right' },
                  { nameWidth: 'w-16', align: 'right' },
                  { nameWidth: 'w-16', align: 'center' },
                ]
          }
          rows={12}
        />
      </div>

      {/* Pagination controls footer skeleton */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#D9E3EE] dark:border-[#222634]">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </ChartCardSkeleton>
  );
};

/**
 * Data Explorer Full Page Skeleton (for Suspense)
 */
export const DataExplorerSkeleton: React.FC<{ view?: 'sales' | 'inventory' }> = ({
  view = 'sales',
}) => {
  return (
    <div className="space-y-6 animate-fadeIn" role="status" aria-label="Loading Data Explorer">
      {/* View Switcher & Action Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#DCE5EF] dark:border-[#222634] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#E2ECF5] dark:bg-[#090A0F] p-1 rounded-xl border border-[#CBDCEB] dark:border-[#222634]">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          {view === 'inventory' && <Skeleton className="h-8 w-36 rounded-lg" />}
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main Table Content */}
      <DataExplorerTableSkeleton view={view} />
    </div>
  );
};

/**
 * Universal Dashboard Skeleton Router
 */
export const DashboardSkeleton: React.FC<{ tab?: NavTab | string }> = ({ tab = 'overview' }) => {
  switch (tab) {
    case 'sales':
      return <SalesAnalyticsSkeleton />;
    case 'stores':
      return <StoreCategorySkeleton />;
    case 'risk':
      return <RiskAnalysisSkeleton />;
    case 'pareto':
      return <ParetoSkeleton />;
    case 'explorer':
      return <DataExplorerSkeleton />;
    case 'overview':
    default:
      return <OverviewSkeleton />;
  }
};
