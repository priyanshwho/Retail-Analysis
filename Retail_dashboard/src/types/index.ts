export interface HealthStatus {
  status: string;
  database: string;
  timestamp: string;
  counts: {
    stores: number;
    skus: number;
    inventory: number;
    sales: number;
  };
}

export interface OverviewKPI {
  total_revenue: number;
  total_profit: number;
  profit_margin_pct: number;
  total_orders: number;
  total_units_sold: number;
  active_stores: number;
  total_skus: number;
  low_stock_alerts: number;
}

export interface ChannelBreakdown {
  channel: string;
  revenue: number;
  profit: number;
  orders: number;
  percentage: number;
}

export interface TopPerformer {
  id: number;
  name: string;
  revenue: number;
  profit: number;
  margin_pct: number;
}

export interface DashboardOverview {
  kpis: OverviewKPI;
  sales_trend: Array<{
    date: string;
    revenue: number;
    profit: number;
    units: number;
  }>;
  channels: ChannelBreakdown[];
  top_stores: TopPerformer[];
  top_categories: TopPerformer[];
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  profit: number;
  units: number;
  orders: number;
}

export interface CategoryPerformanceItem {
  category: string;
  revenue: number;
  profit: number;
  margin_pct: number;
  units: number;
  skus_count: number;
}

export interface StorePerformanceItem {
  store_id: number;
  store_name: string;
  city: string;
  store_type: string;
  revenue: number;
  profit: number;
  margin_pct: number;
  units: number;
  orders: number;
}

export interface CityComparisonItem {
  city: string;
  revenue: number;
  profit: number;
  margin_pct: number;
  store_count: number;
}

export interface StoreTypeComparisonItem {
  store_type: string;
  revenue: number;
  profit: number;
  margin_pct: number;
  store_count: number;
}

export interface RiskItem {
  sku_id: number;
  sku_name: string;
  category: string;
  brand: string;
  total_sales_quantity: number | null;
  total_revenue: number | null;
  total_profit: number | null;
  stock_on_hand: number | null;
  reorder_point: number | null;
  safety_stock: number | null;
  reason: string;
}

export interface RiskAnalysisResponse {
  high_sales_low_stock: RiskItem[];
  low_stock: RiskItem[];
  high_sales_low_profit: RiskItem[];
}

export interface ParetoItem {
  sku_id: number;
  sku_name: string;
  category: string;
  revenue: number;
  cumulative_revenue: number;
  cumulative_percentage: number;
  is_top_80: boolean;
}

export interface ParetoResponse {
  total_revenue: number;
  total_skus: number;
  top_80_skus_count: number;
  top_80_skus_percentage: number;
  items: ParetoItem[];
}

export interface SalesRecord {
  id: number;
  date: string;
  store_id: number;
  store_name: string;
  sku_id: number;
  sku_name: string;
  category: string;
  customer_id: number | null;
  quantity: number;
  unit_price: number;
  cost_price: number;
  total_value: number;
  profit: number;
  channel: string;
  discount_pct: number | null;
}

export interface InventoryRecord {
  store_id: number;
  store_name: string;
  city: string;
  sku_id: number;
  sku_name: string;
  category: string;
  stock_on_hand: number;
  reorder_point: number;
  safety_stock: number;
  last_restock_date: string | null;
  snapshot_date: string;
  status: 'Critical' | 'Warning' | 'Normal' | 'Overstocked';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FilterOptions {
  cities: string[];
  store_types: string[];
  categories: string[];
  channels: string[];
  brands: string[];
  stores: Array<{ store_id: number; store_name: string; city: string }>;
  date_range: { min: string; max: string };
}

export interface ActiveFilters {
  start_date?: string;
  end_date?: string;
  city?: string;
  store_type?: string;
  category?: string;
  channel?: string;
  brand?: string;
  store_id?: number;
}
