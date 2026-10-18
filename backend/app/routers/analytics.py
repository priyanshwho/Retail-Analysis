"""Analytics API router for sales trends, category performance, store rankings, risk analysis, and Pareto."""

from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    SalesTrendResponse,
    CategoryPerformanceItem,
    RiskAnalysisResponse,
    ParetoResponse,
)
from app.services.analytics import AnalyticsService
from app.cache import cache

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/sales-trend", response_model=SalesTrendResponse)
def get_sales_trend(
    granularity: str = Query("month", pattern="^(day|week|month|year)$"),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    city: str | None = Query(None),
    store_type: str | None = Query(None),
    category: str | None = Query(None),
    channel: str | None = Query(None),
    brand: str | None = Query(None),
    store_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    """Retrieve aggregated revenue, profit, units, and order volume by time period."""
    cache_key = f"trend:{granularity}:{start_date}:{end_date}:{city}:{store_type}:{category}:{channel}:{brand}:{store_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    data = AnalyticsService.get_sales_trend(
        db,
        granularity=granularity,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        category=category,
        channel=channel,
        brand=brand,
        store_id=store_id,
    )
    result = {"granularity": granularity, "data": data}
    cache.set(cache_key, result, ttl=300)
    return result


@router.get("/category-performance", response_model=list[CategoryPerformanceItem])
def get_category_performance(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    city: str | None = Query(None),
    store_type: str | None = Query(None),
    channel: str | None = Query(None),
    brand: str | None = Query(None),
    store_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    """Retrieve category performance metrics including revenue, profit, and margin %."""
    cache_key = f"cat_perf:{start_date}:{end_date}:{city}:{store_type}:{channel}:{brand}:{store_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = AnalyticsService.get_category_performance(
        db,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        channel=channel,
        brand=brand,
        store_id=store_id,
    )
    cache.set(cache_key, result, ttl=300)
    return result


@router.get("/store-performance")
def get_store_performance(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    city: str | None = Query(None),
    store_type: str | None = Query(None),
    category: str | None = Query(None),
    channel: str | None = Query(None),
    brand: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """Retrieve store-level rankings, city comparisons, and store format comparisons."""
    cache_key = f"store_perf:{start_date}:{end_date}:{city}:{store_type}:{category}:{channel}:{brand}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = AnalyticsService.get_store_performance(
        db,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        category=category,
        channel=channel,
        brand=brand,
    )
    cache.set(cache_key, result, ttl=300)
    return result


@router.get("/risk-analysis", response_model=RiskAnalysisResponse)
def get_risk_analysis(db: Session = Depends(get_db)):
    """Retrieve risk quadrants."""
    cache_key = "risk_analysis"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = AnalyticsService.get_risk_analysis(db)
    cache.set(cache_key, result, ttl=300)
    return result


@router.get("/pareto", response_model=ParetoResponse)
def get_pareto(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    city: str | None = Query(None),
    store_type: str | None = Query(None),
    category: str | None = Query(None),
    channel: str | None = Query(None),
    brand: str | None = Query(None),
    store_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    """Retrieve 80/20 cumulative revenue analysis across catalog SKUs."""
    cache_key = f"pareto:{start_date}:{end_date}:{city}:{store_type}:{category}:{channel}:{brand}:{store_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = AnalyticsService.get_pareto_analysis(
        db,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        category=category,
        channel=channel,
        brand=brand,
        store_id=store_id,
    )
    cache.set(cache_key, result, ttl=300)
    return result
