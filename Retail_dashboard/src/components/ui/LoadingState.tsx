import React from 'react';
import {
  Skeleton,
  KPICardSkeleton,
  ChartCardSkeleton,
  AreaChartSkeleton,
  DonutChartSkeleton,
  BarChartSkeleton,
  TableSkeleton,
  OverviewSkeleton,
  SalesAnalyticsSkeleton,
  StoreCategorySkeleton,
  RiskAnalysisSkeleton,
  ParetoSkeleton,
  DataExplorerSkeleton,
  DashboardSkeleton,
} from './Skeleton';
import type { NavTab } from '../layout/Sidebar';

export interface LoadingStateProps {
  message?: string;
  tab?: NavTab | string;
}

/**
 * Replaces the old spinner loading state with exact-shape-and-size responsive skeleton blocks
 * matching the light and dark color themes.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ tab = 'overview' }) => {
  return <DashboardSkeleton tab={tab} />;
};

export {
  Skeleton,
  KPICardSkeleton,
  ChartCardSkeleton,
  AreaChartSkeleton,
  DonutChartSkeleton,
  BarChartSkeleton,
  TableSkeleton,
  OverviewSkeleton,
  SalesAnalyticsSkeleton,
  StoreCategorySkeleton,
  RiskAnalysisSkeleton,
  ParetoSkeleton,
  DataExplorerSkeleton,
  DashboardSkeleton,
};
export default LoadingState;
