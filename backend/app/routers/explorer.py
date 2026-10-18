"""Data Explorer API router for filter options, sales transactions, and inventory snapshot queries."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    FilterOptionsResponse,
    PaginatedResponse,
    SalesExplorerItem,
    InventoryExplorerItem,
)
from app.services.data_explorer import DataExplorerService

router = APIRouter(prefix="/api/explorer", tags=["Data Explorer"])


@router.get("/filters", response_model=FilterOptionsResponse)
def get_filter_options(db: Session = Depends(get_db)):
    """Retrieve distinct filter options for dropdown selectors across the dashboard."""
    return DataExplorerService.get_filter_options(db)


@router.get("/sales", response_model=PaginatedResponse[SalesExplorerItem])
def get_sales_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    sort_by: str = Query("date"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
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
    """Retrieve paginated, filterable sales transaction records with dynamic sorting."""
    return DataExplorerService.get_sales_records(
        db,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        start_date=start_date,
        end_date=end_date,
        city=city,
        store_type=store_type,
        category=category,
        channel=channel,
        brand=brand,
        store_id=store_id,
    )


@router.get("/inventory", response_model=PaginatedResponse[InventoryExplorerItem])
def get_inventory_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    store_id: int | None = Query(None),
    category: str | None = Query(None),
    status: str | None = Query(None, description="Critical, Warning, Normal, or Overstocked"),
    db: Session = Depends(get_db),
):
    """Retrieve paginated inventory records with stock status flags."""
    return DataExplorerService.get_inventory_records(
        db,
        page=page,
        page_size=page_size,
        store_id=store_id,
        category=category,
        status_filter=status,
    )
