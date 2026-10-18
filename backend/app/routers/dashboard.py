"""Dashboard overview API router."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import DashboardOverviewResponse
from app.services.analytics import AnalyticsService
from app.cache import cache

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(
    start_date: str | None = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: str | None = Query(None, description="End date (YYYY-MM-DD)"),
    city: str | None = Query(None),
    store_type: str | None = Query(None),
    category: str | None = Query(None),
    channel: str | None = Query(None),
    brand: str | None = Query(None),
    store_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    """Retrieve high-level KPIs, monthly trend, channel distribution, top stores, and top categories."""
    cache_key = f"overview:{start_date}:{end_date}:{city}:{store_type}:{category}:{channel}:{brand}:{store_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    data = AnalyticsService.get_dashboard_overview(
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
    cache.set(cache_key, data, ttl=300)
    return data
