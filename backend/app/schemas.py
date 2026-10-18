"""Pydantic schemas for Retail Analytics API."""

from __future__ import annotations

from datetime import date, datetime
from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: datetime
    counts: dict[str, int]


# --- Overview & KPIs ---
class OverviewKPI(BaseModel):
    total_revenue: float
    total_profit: float
    profit_margin_pct: float
    total_orders: int
    total_units_sold: int
    active_stores: int
    total_skus: int
    low_stock_alerts: int


class ChannelBreakdown(BaseModel):
    channel: str
    revenue: float
    profit: float
    orders: int
    percentage: float


class TopPerformer(BaseModel):
    id: int
    name: str
    revenue: float
    profit: float
    margin_pct: float


class DashboardOverviewResponse(BaseModel):
    kpis: OverviewKPI
    sales_trend: list[dict[str, str | float | int]]
    channels: list[ChannelBreakdown]
    top_stores: list[TopPerformer]
    top_categories: list[TopPerformer]


# --- Sales Trends ---
class SalesTrendPoint(BaseModel):
    date: str
    revenue: float
    profit: float
    units: int
    orders: int


class SalesTrendResponse(BaseModel):
    granularity: str
    data: list[SalesTrendPoint]


# --- Category & Store Analytics ---
class CategoryPerformanceItem(BaseModel):
    category: str
    revenue: float
    profit: float
    margin_pct: float
    units: int
    skus_count: int


class StorePerformanceItem(BaseModel):
    store_id: int
    store_name: str
    city: str
    store_type: str
    revenue: float
    profit: float
    margin_pct: float
    units: int
    orders: int


class CityComparisonItem(BaseModel):
    city: str
    revenue: float
    profit: float
    margin_pct: float
    store_count: int


class StoreTypeComparisonItem(BaseModel):
    store_type: str
    revenue: float
    profit: float
    margin_pct: float
    store_count: int


# --- Risk Analysis ---
class RiskAnalysisItem(BaseModel):
    sku_id: int
    sku_name: str
    category: str
    brand: str
    total_sales_quantity: int | None = None
    total_revenue: float | None = None
    total_profit: float | None = None
    stock_on_hand: int | None = None
    reorder_point: int | None = None
    safety_stock: int | None = None
    reason: str


class RiskAnalysisResponse(BaseModel):
    high_sales_low_stock: list[RiskAnalysisItem]
    low_stock: list[RiskAnalysisItem]
    high_sales_low_profit: list[RiskAnalysisItem]


# --- Pareto Analysis ---
class ParetoItem(BaseModel):
    sku_id: int
    sku_name: str
    category: str
    revenue: float
    cumulative_revenue: float
    cumulative_percentage: float
    is_top_80: bool


class ParetoResponse(BaseModel):
    total_revenue: float
    total_skus: int
    top_80_skus_count: int
    top_80_skus_percentage: float
    items: list[ParetoItem]


# --- Inventory Status ---
class InventoryStatusItem(BaseModel):
    store_id: int
    store_name: str
    city: str
    sku_id: int
    sku_name: str
    category: str
    stock_on_hand: int
    reorder_point: int
    safety_stock: int
    status: str  # "Critical", "Warning", "Normal", "Overstocked"


# --- Paginated Explorer ---
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class SalesExplorerItem(BaseModel):
    id: int
    date: str
    store_id: int
    store_name: str
    sku_id: int
    sku_name: str
    category: str
    customer_id: int | None
    quantity: int
    unit_price: float
    cost_price: float
    total_value: float
    profit: float
    channel: str
    discount_pct: float | None


class InventoryExplorerItem(BaseModel):
    store_id: int
    store_name: str
    city: str
    sku_id: int
    sku_name: str
    category: str
    stock_on_hand: int
    reorder_point: int
    safety_stock: int
    last_restock_date: str | None
    snapshot_date: str


class FilterOptionsResponse(BaseModel):
    cities: list[str]
    store_types: list[str]
    categories: list[str]
    channels: list[str]
    brands: list[str]
    stores: list[dict[str, str | int]]
    date_range: dict[str, str]
