"""Data Explorer service for querying, filtering, and paginating sales and inventory records."""

from __future__ import annotations

import math
from typing import Any
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.analytics import build_filter_clause


class DataExplorerService:
    @staticmethod
    def get_filter_options(db: Session) -> dict[str, Any]:
        """Fetch distinct filter values across stores, skus, and sales."""
        cities = [r[0] for r in db.execute(text("SELECT DISTINCT city FROM stores ORDER BY city")).all()]
        store_types = [r[0] for r in db.execute(text("SELECT DISTINCT store_type FROM stores ORDER BY store_type")).all()]
        categories = [r[0] for r in db.execute(text("SELECT DISTINCT category FROM skus ORDER BY category")).all()]
        brands = [r[0] for r in db.execute(text("SELECT DISTINCT brand FROM skus ORDER BY brand")).all()]
        channels = [r[0] for r in db.execute(text("SELECT DISTINCT channel FROM sales ORDER BY channel")).all()]

        stores = [
            {"store_id": r[0], "store_name": r[1], "city": r[2]}
            for r in db.execute(text("SELECT store_id, store_name, city FROM stores ORDER BY store_name")).all()
        ]

        date_range_row = db.execute(text("SELECT MIN(date), MAX(date) FROM sales")).one()
        min_date = str(date_range_row[0]) if date_range_row[0] else ""
        max_date = str(date_range_row[1]) if date_range_row[1] else ""

        return {
            "cities": cities,
            "store_types": store_types,
            "categories": categories,
            "channels": channels,
            "brands": brands,
            "stores": stores,
            "date_range": {"min": min_date, "max": max_date},
        }

    @staticmethod
    def get_sales_records(
        db: Session,
        page: int = 1,
        page_size: int = 50,
        sort_by: str = "date",
        sort_order: str = "desc",
        **filters,
    ) -> dict[str, Any]:
        """Fetch paginated, filtered sales records."""
        where_clause, params = build_filter_clause(**filters)

        # Allowed sort columns to prevent SQL injection
        allowed_sorts = {
            "id": "s.id",
            "date": "s.date",
            "store_name": "st.store_name",
            "sku_name": "sk.sku_name",
            "category": "sk.category",
            "quantity": "s.quantity",
            "unit_price": "s.unit_price",
            "total_value": "s.total_value",
            "profit": "profit",
            "channel": "s.channel",
        }
        sort_col = allowed_sorts.get(sort_by, "s.date")
        direction = "ASC" if sort_order.lower() == "asc" else "DESC"

        # Count total
        count_query = text(f"""
            SELECT COUNT(s.id)
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
        """)
        total_count = db.execute(count_query, params).scalar() or 0

        # Query page
        offset = (page - 1) * page_size
        params_with_paging = {**params, "limit": page_size, "offset": offset}

        data_query = text(f"""
            SELECT
                s.id,
                s.date,
                s.store_id,
                st.store_name,
                s.sku_id,
                sk.sku_name,
                sk.category,
                s.customer_id,
                s.quantity,
                s.unit_price,
                sk.cost_price,
                s.total_value,
                (s.total_value - (s.quantity * sk.cost_price)) AS profit,
                s.channel,
                s.discount_pct
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            ORDER BY {sort_col} {direction}
            LIMIT :limit OFFSET :offset
        """)
        rows = db.execute(data_query, params_with_paging).mappings().all()

        items = [
            {
                "id": r["id"],
                "date": str(r["date"]),
                "store_id": r["store_id"],
                "store_name": r["store_name"],
                "sku_id": r["sku_id"],
                "sku_name": r["sku_name"],
                "category": r["category"],
                "customer_id": r["customer_id"],
                "quantity": int(r["quantity"]),
                "unit_price": float(r["unit_price"]),
                "cost_price": float(r["cost_price"]),
                "total_value": float(r["total_value"]),
                "profit": round(float(r["profit"]), 2),
                "channel": r["channel"],
                "discount_pct": float(r["discount_pct"]) if r["discount_pct"] is not None else None,
            }
            for r in rows
        ]

        total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

        return {
            "items": items,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def get_inventory_records(
        db: Session,
        page: int = 1,
        page_size: int = 50,
        store_id: int | None = None,
        category: str | None = None,
        status_filter: str | None = None,
    ) -> dict[str, Any]:
        """Fetch paginated inventory snapshot records with health status."""
        clauses = ["1=1"]
        params: dict[str, Any] = {}

        if store_id:
            clauses.append("i.store_id = :store_id")
            params["store_id"] = store_id
        if category:
            clauses.append("sk.category = :category")
            params["category"] = category

        if status_filter == "Critical":
            clauses.append("i.stock_on_hand <= i.safety_stock")
        elif status_filter == "Warning":
            clauses.append("i.stock_on_hand < i.reorder_point AND i.stock_on_hand > i.safety_stock")
        elif status_filter == "Overstocked":
            clauses.append("i.stock_on_hand > (i.reorder_point * 3)")
        elif status_filter == "Normal":
            clauses.append("i.stock_on_hand >= i.reorder_point AND i.stock_on_hand <= (i.reorder_point * 3)")

        where_clause = " AND ".join(clauses)

        count_query = text(f"""
            SELECT COUNT(*)
            FROM inventory i
            JOIN skus sk ON i.sku_id = sk.sku_id
            JOIN stores st ON i.store_id = st.store_id
            WHERE {where_clause}
        """)
        total_count = db.execute(count_query, params).scalar() or 0

        offset = (page - 1) * page_size
        params_with_paging = {**params, "limit": page_size, "offset": offset}

        data_query = text(f"""
            SELECT
                i.store_id,
                st.store_name,
                st.city,
                i.sku_id,
                sk.sku_name,
                sk.category,
                i.stock_on_hand,
                i.reorder_point,
                i.safety_stock,
                i.last_restock_date,
                i.snapshot_date,
                CASE
                    WHEN i.stock_on_hand <= i.safety_stock THEN 'Critical'
                    WHEN i.stock_on_hand < i.reorder_point THEN 'Warning'
                    WHEN i.stock_on_hand > (i.reorder_point * 3) THEN 'Overstocked'
                    ELSE 'Normal'
                END AS status
            FROM inventory i
            JOIN skus sk ON i.sku_id = sk.sku_id
            JOIN stores st ON i.store_id = st.store_id
            WHERE {where_clause}
            ORDER BY
                CASE
                    WHEN i.stock_on_hand <= i.safety_stock THEN 1
                    WHEN i.stock_on_hand < i.reorder_point THEN 2
                    ELSE 3
                END,
                (i.reorder_point - i.stock_on_hand) DESC
            LIMIT :limit OFFSET :offset
        """)
        rows = db.execute(data_query, params_with_paging).mappings().all()

        items = [
            {
                "store_id": r["store_id"],
                "store_name": r["store_name"],
                "city": r["city"],
                "sku_id": r["sku_id"],
                "sku_name": r["sku_name"],
                "category": r["category"],
                "stock_on_hand": int(r["stock_on_hand"]),
                "reorder_point": int(r["reorder_point"]),
                "safety_stock": int(r["safety_stock"]),
                "last_restock_date": str(r["last_restock_date"]) if r["last_restock_date"] else None,
                "snapshot_date": str(r["snapshot_date"]),
                "status": r["status"],
            }
            for r in rows
        ]

        total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

        return {
            "items": items,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }
