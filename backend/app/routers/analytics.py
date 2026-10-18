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
    return {"granularity": granularity, "data": data}


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
    return AnalyticsService.get_category_performance(
        db,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        channel=channel,
        brand=brand,
        store_id=store_id,
    )


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
    return AnalyticsService.get_store_performance(
        db,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        category=category,
        channel=channel,
        brand=brand,
    )


@router.get("/risk-analysis", response_model=RiskAnalysisResponse)
def get_risk_analysis(db: Session = Depends(get_db)):
    """Retrieve risk quadrants:

    1. High sales & low stock (stockout risk)
    2. Low stock (below reorder point)
    3. High sales & low profit (margin risk)
    """
    return AnalyticsService.get_risk_analysis(db)


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
    return AnalyticsService.get_pareto_analysis(
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
