import type {
  HealthStatus,
  DashboardOverview,
  SalesTrendPoint,
  CategoryPerformanceItem,
  StorePerformanceItem,
  CityComparisonItem,
  StoreTypeComparisonItem,
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

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

async function request<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  options?: { bypassCache?: boolean; ttlMs?: number }
): Promise<T> {
  const url = `${BASE_URL}${endpoint}${buildQuery(params as Record<string, string | number | undefined | null>)}`;
  const now = Date.now();

  // Return instant cached response if valid
  if (!options?.bypassCache && memoryCache.has(url)) {
    const entry = memoryCache.get(url)!;
    if (now < entry.expiry) {
      return entry.data as T;
    }
    memoryCache.delete(url);
  }

  // Deduplicate concurrent in-flight requests for the same URL
  if (!options?.bypassCache && pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }

  const reqPromise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
      }
      const data: T = await res.json();
      const ttl = options?.ttlMs ?? DEFAULT_TTL_MS;
      memoryCache.set(url, { data, expiry: Date.now() + ttl });
      return data;
    } finally {
      pendingRequests.delete(url);
    }
  })();

  pendingRequests.set(url, reqPromise);
  return reqPromise;
}

export const api = {
  clearCache: async () => {
    memoryCache.clear();
    pendingRequests.clear();
    try {
      await fetch(`${BASE_URL}/api/cache/clear`, { method: 'POST' });
    } catch {
      // ignore
    }
  },
  getHealth: () => request<HealthStatus>('/api/health', undefined, { ttlMs: 30 * 1000 }),
  getOverview: (filters?: ActiveFilters, bypassCache = false) =>
    request<DashboardOverview>('/api/dashboard/overview', filters as Record<string, string | number | undefined>, { bypassCache }),
  getSalesTrend: (granularity: 'day' | 'week' | 'month' | 'year' = 'month', filters?: ActiveFilters, bypassCache = false) =>
    request<{ granularity: string; data: SalesTrendPoint[] }>(
      '/api/analytics/sales-trend',
      { granularity, ...filters },
      { bypassCache }
    ),
  getCategoryPerformance: (filters?: ActiveFilters, bypassCache = false) =>
    request<CategoryPerformanceItem[]>(
      '/api/analytics/category-performance',
      filters as Record<string, string | number | undefined>,
      { bypassCache }
    ),
  getStorePerformance: (filters?: ActiveFilters, bypassCache = false) =>
    request<{
      stores: StorePerformanceItem[];
      cities: CityComparisonItem[];
      store_types: StoreTypeComparisonItem[];
    }>('/api/analytics/store-performance', filters as Record<string, string | number | undefined>, { bypassCache }),
  getRiskAnalysis: (bypassCache = false) =>
    request<RiskAnalysisResponse>('/api/analytics/risk-analysis', undefined, { bypassCache }),
  getPareto: (filters?: ActiveFilters, bypassCache = false) =>
    request<ParetoResponse>('/api/analytics/pareto', filters, { bypassCache }),
  getFilters: () => request<FilterOptions>('/api/explorer/filters', undefined, { ttlMs: 30 * 60 * 1000 }),
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
