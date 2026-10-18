import type {
  HealthStatus,
  DashboardOverview,
  SalesTrendPoint,
  CategoryPerformanceItem,
  RiskAnalysisResponse,
  ParetoResponse,
  PaginatedResponse,
  SalesRecord,
  InventoryRecord,
  FilterOptions,
  ActiveFilters,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

async function request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = `${BASE_URL}${endpoint}${buildQuery(params)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getHealth: () => request<HealthStatus>('/api/health'),
  getOverview: (filters?: ActiveFilters) => request<DashboardOverview>('/api/dashboard/overview', filters),
  getSalesTrend: (granularity: 'day' | 'week' | 'month' | 'year' = 'month', filters?: ActiveFilters) =>
    request<{ granularity: string; data: SalesTrendPoint[] }>('/api/analytics/sales-trend', {
      granularity,
      ...filters,
    }),
  getCategoryPerformance: (filters?: ActiveFilters) =>
    request<CategoryPerformanceItem[]>('/api/analytics/category-performance', filters),
  getStorePerformance: (filters?: ActiveFilters) =>
    request<{
      stores: any[];
      cities: any[];
      store_types: any[];
    }>('/api/analytics/store-performance', filters),
  getRiskAnalysis: () => request<RiskAnalysisResponse>('/api/analytics/risk-analysis'),
  getPareto: (filters?: ActiveFilters) => request<ParetoResponse>('/api/analytics/pareto', filters),
  getFilters: () => request<FilterOptions>('/api/explorer/filters'),
  getSalesRecords: (
    page = 1,
    pageSize = 50,
    sortBy = 'date',
    sortOrder: 'asc' | 'desc' = 'desc',
    filters?: ActiveFilters
  ) =>
    request<PaginatedResponse<SalesRecord>>('/api/explorer/sales', {
      page,
      page_size: pageSize,
      sort_by: sortBy,
      sort_order: sortOrder,
      ...filters,
    }),
  getInventoryRecords: (
    page = 1,
    pageSize = 50,
    storeId?: number,
    category?: string,
    status?: string
  ) =>
    request<PaginatedResponse<InventoryRecord>>('/api/explorer/inventory', {
      page,
      page_size: pageSize,
      store_id: storeId,
      category,
      status,
    }),
};
