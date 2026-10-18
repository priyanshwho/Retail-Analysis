"""Analytics service implementing core retail business logic and PostgreSQL aggregations."""

from __future__ import annotations

from typing import Any
from sqlalchemy import text
from sqlalchemy.orm import Session


def build_filter_clause(
    start_date: str | None = None,
    end_date: str | None = None,
    city: str | None = None,
    store_type: str | None = None,
    category: str | None = None,
    channel: str | None = None,
    brand: str | None = None,
    store_id: int | None = None,
    sales_prefix: str = "s",
    stores_prefix: str = "st",
    skus_prefix: str = "sk",
) -> tuple[str, dict[str, Any]]:
    """Build dynamic WHERE clauses and parameter dict."""
    clauses = ["1=1"]
    params: dict[str, Any] = {}

    if start_date:
        clauses.append(f"{sales_prefix}.date >= :start_date")
        params["start_date"] = start_date
    if end_date:
        clauses.append(f"{sales_prefix}.date <= :end_date")
        params["end_date"] = end_date
    if city:
        clauses.append(f"{stores_prefix}.city = :city")
        params["city"] = city
    if store_type:
        clauses.append(f"{stores_prefix}.store_type = :store_type")
        params["store_type"] = store_type
    if category:
        clauses.append(f"{skus_prefix}.category = :category")
        params["category"] = category
    if channel:
        clauses.append(f"{sales_prefix}.channel = :channel")
        params["channel"] = channel
    if brand:
        clauses.append(f"{skus_prefix}.brand = :brand")
        params["brand"] = brand
    if store_id:
        clauses.append(f"{sales_prefix}.store_id = :store_id")
        params["store_id"] = store_id

    return " AND ".join(clauses), params


class AnalyticsService:
    @staticmethod
    def get_dashboard_overview(db: Session, **filters) -> dict[str, Any]:
        """Aggregate high-level KPIs, channels, top stores, and top categories."""
        where_clause, params = build_filter_clause(**filters)

        # 1. High-level KPIs
        kpi_query = text(f"""
            SELECT
                COALESCE(SUM(s.total_value), 0) AS total_revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS total_profit,
                COALESCE(COUNT(s.id), 0) AS total_orders,
                COALESCE(SUM(s.quantity), 0) AS total_units_sold,
                COUNT(DISTINCT s.store_id) AS active_stores,
                COUNT(DISTINCT s.sku_id) AS active_skus
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
        """)
        kpi_row = db.execute(kpi_query, params).mappings().one()

        revenue = float(kpi_row["total_revenue"])
        profit = float(kpi_row["total_profit"])
        margin_pct = round((profit / revenue * 100), 2) if revenue > 0 else 0.0

        # Total SKUs from skus table
        total_skus = db.execute(text("SELECT COUNT(*) FROM skus")).scalar() or 0

        # Low stock count (inventory items below reorder point)
        low_stock_count = db.execute(text("""
            SELECT COUNT(*)
            FROM inventory
            WHERE stock_on_hand < reorder_point
        """)).scalar() or 0

        kpis = {
            "total_revenue": round(revenue, 2),
            "total_profit": round(profit, 2),
            "profit_margin_pct": margin_pct,
            "total_orders": int(kpi_row["total_orders"]),
            "total_units_sold": int(kpi_row["total_units_sold"]),
            "active_stores": int(kpi_row["active_stores"]),
            "total_skus": total_skus,
            "low_stock_alerts": low_stock_count,
        }

        # 2. Monthly Trend
        trend_query = text(f"""
            SELECT
                TO_CHAR(s.date, 'YYYY-MM') AS month_str,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COALESCE(SUM(s.quantity), 0) AS units
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY TO_CHAR(s.date, 'YYYY-MM')
            ORDER BY month_str ASC
        """)
        trend_rows = db.execute(trend_query, params).mappings().all()
        trend_data = [
            {
                "date": row["month_str"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "units": int(row["units"]),
            }
            for row in trend_rows
        ]

        # 3. Channel breakdown
        channel_query = text(f"""
            SELECT
                s.channel,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COUNT(s.id) AS orders
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY s.channel
            ORDER BY revenue DESC
        """)
        channel_rows = db.execute(channel_query, params).mappings().all()
        channels = [
            {
                "channel": row["channel"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "orders": int(row["orders"]),
                "percentage": round(float(row["revenue"]) / revenue * 100, 2) if revenue > 0 else 0.0,
            }
            for row in channel_rows
        ]

        # 4. Top 5 Stores
        stores_query = text(f"""
            SELECT
                st.store_id AS id,
                st.store_name AS name,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY st.store_id, st.store_name
            ORDER BY revenue DESC
            LIMIT 5
        """)
        top_stores = [
            {
                "id": row["id"],
                "name": row["name"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
            }
            for row in db.execute(stores_query, params).mappings().all()
        ]

        # 5. Top 5 Categories
        cats_query = text(f"""
            SELECT
                0 AS id,
                sk.category AS name,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY sk.category
            ORDER BY revenue DESC
            LIMIT 5
        """)
        top_categories = [
            {
                "id": idx + 1,
                "name": row["name"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
            }
            for idx, row in enumerate(db.execute(cats_query, params).mappings().all())
        ]

        return {
            "kpis": kpis,
            "sales_trend": trend_data,
            "channels": channels,
            "top_stores": top_stores,
            "top_categories": top_categories,
        }

    @staticmethod
    def get_sales_trend(
        db: Session,
        granularity: str = "month",
        **filters,
    ) -> list[dict[str, Any]]:
        """Granular sales trend: day, week, or month."""
        where_clause, params = build_filter_clause(**filters)

        format_map = {
            "day": "YYYY-MM-DD",
            "week": "IYYY-IW",
            "month": "YYYY-MM",
            "year": "YYYY",
        }
        date_format = format_map.get(granularity, "YYYY-MM")

        query = text(f"""
            SELECT
                TO_CHAR(s.date, '{date_format}') AS period_label,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COALESCE(SUM(s.quantity), 0) AS units,
                COUNT(s.id) AS orders
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY period_label
            ORDER BY period_label ASC
        """)
        rows = db.execute(query, params).mappings().all()
        return [
            {
                "date": row["period_label"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "units": int(row["units"]),
                "orders": int(row["orders"]),
            }
            for row in rows
        ]

    @staticmethod
    def get_category_performance(db: Session, **filters) -> list[dict[str, Any]]:
        """Performance breakdown by product category."""
        where_clause, params = build_filter_clause(**filters)

        query = text(f"""
            SELECT
                sk.category,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COALESCE(SUM(s.quantity), 0) AS units,
                COUNT(DISTINCT s.sku_id) AS skus_count
            FROM sales s
            JOIN skus sk ON s.sku_id = sk.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY sk.category
            ORDER BY revenue DESC
        """)
        rows = db.execute(query, params).mappings().all()
        return [
            {
                "category": row["category"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
                "units": int(row["units"]),
                "skus_count": int(row["skus_count"]),
            }
            for row in rows
        ]

    @staticmethod
    def get_store_performance(db: Session, **filters) -> dict[str, Any]:
        """Store performance rankings, city comparisons, and store type comparisons."""
        where_clause, params = build_filter_clause(**filters)

        # Store rankings
        store_query = text(f"""
            SELECT
                st.store_id,
                st.store_name,
                st.city,
                st.store_type,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COALESCE(SUM(s.quantity), 0) AS units,
                COUNT(s.id) AS orders
            FROM stores st
            LEFT JOIN sales s ON st.store_id = s.store_id
            LEFT JOIN skus sk ON s.sku_id = sk.sku_id
            WHERE {where_clause}
            GROUP BY st.store_id, st.store_name, st.city, st.store_type
            ORDER BY revenue DESC
        """)
        store_rows = db.execute(store_query, params).mappings().all()
        stores = [
            {
                "store_id": row["store_id"],
                "store_name": row["store_name"],
                "city": row["city"],
                "store_type": row["store_type"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
                "units": int(row["units"]),
                "orders": int(row["orders"]),
            }
            for row in store_rows
        ]

        # By City
        city_query = text(f"""
            SELECT
                st.city,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COUNT(DISTINCT st.store_id) AS store_count
            FROM stores st
            LEFT JOIN sales s ON st.store_id = s.store_id
            LEFT JOIN skus sk ON s.sku_id = sk.sku_id
            WHERE {where_clause}
            GROUP BY st.city
            ORDER BY revenue DESC
        """)
        cities = [
            {
                "city": row["city"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
                "store_count": int(row["store_count"]),
            }
            for row in db.execute(city_query, params).mappings().all()
        ]

        # By Store Type
        type_query = text(f"""
            SELECT
                st.store_type,
                COALESCE(SUM(s.total_value), 0) AS revenue,
                COALESCE(SUM(s.total_value - (s.quantity * sk.cost_price)), 0) AS profit,
                COUNT(DISTINCT st.store_id) AS store_count
            FROM stores st
            LEFT JOIN sales s ON st.store_id = s.store_id
            LEFT JOIN skus sk ON s.sku_id = sk.sku_id
            WHERE {where_clause}
            GROUP BY st.store_type
            ORDER BY revenue DESC
        """)
        store_types = [
            {
                "store_type": row["store_type"],
                "revenue": round(float(row["revenue"]), 2),
                "profit": round(float(row["profit"]), 2),
                "margin_pct": round(float(row["profit"]) / float(row["revenue"]) * 100, 2)
                if float(row["revenue"]) > 0 else 0.0,
                "store_count": int(row["store_count"]),
            }
            for row in db.execute(type_query, params).mappings().all()
        ]

        return {"stores": stores, "cities": cities, "store_types": store_types}

    @staticmethod
    def get_risk_analysis(db: Session) -> dict[str, Any]:
        """Calculates risk categories identified in the exploratory data analysis:

        1. high_sales_low_stock: Products with sales quantity > median AND stock on hand < median.
        2. low_stock: Inventory records where stock on hand < reorder point.
        3. high_sales_low_profit: Products with total sales > median AND total profit < median.
        """
        # 1. Product aggregates with inventory sum
        prod_query = text("""
            WITH prod_sales AS (
                SELECT
                    s.sku_id,
                    SUM(s.quantity) AS total_qty,
                    SUM(s.total_value) AS total_sales,
                    SUM(s.total_value - (s.quantity * sk.cost_price)) AS total_profit
                FROM sales s
                JOIN skus sk ON s.sku_id = sk.sku_id
                GROUP BY s.sku_id
            ),
            prod_inv AS (
                SELECT
                    sku_id,
                    SUM(stock_on_hand) AS total_stock,
                    SUM(reorder_point) AS total_reorder,
                    SUM(safety_stock) AS total_safety
                FROM inventory
                GROUP BY sku_id
            ),
            medians AS (
                SELECT
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY total_qty) AS med_qty,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY total_stock) AS med_stock,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY total_sales) AS med_sales,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY total_profit) AS med_profit
                FROM prod_sales ps
                JOIN prod_inv pi ON ps.sku_id = pi.sku_id
            )
            SELECT
                sk.sku_id,
                sk.sku_name,
                sk.category,
                sk.brand,
                ps.total_qty,
                ps.total_sales,
                ps.total_profit,
                COALESCE(pi.total_stock, 0) AS stock_on_hand,
                COALESCE(pi.total_reorder, 0) AS reorder_point,
                COALESCE(pi.total_safety, 0) AS safety_stock,
                m.med_qty,
                m.med_stock,
                m.med_sales,
                m.med_profit
            FROM skus sk
            JOIN prod_sales ps ON sk.sku_id = ps.sku_id
            LEFT JOIN prod_inv pi ON sk.sku_id = pi.sku_id
            CROSS JOIN medians m
        """)
        rows = db.execute(prod_query).mappings().all()

        high_sales_low_stock = []
        high_sales_low_profit = []

        for r in rows:
            qty = int(r["total_qty"])
            stock = int(r["stock_on_hand"])
            sales = float(r["total_sales"])
            profit = float(r["total_profit"])
            med_qty = float(r["med_qty"])
            med_stock = float(r["med_stock"])
            med_sales = float(r["med_sales"])
            med_profit = float(r["med_profit"])

            if qty > med_qty and stock < med_stock:
                high_sales_low_stock.append({
                    "sku_id": r["sku_id"],
                    "sku_name": r["sku_name"],
                    "category": r["category"],
                    "brand": r["brand"],
                    "total_sales_quantity": qty,
                    "total_revenue": round(sales, 2),
                    "total_profit": round(profit, 2),
                    "stock_on_hand": stock,
                    "reorder_point": int(r["reorder_point"]),
                    "safety_stock": int(r["safety_stock"]),
                    "reason": f"High demand ({qty:,} units sold > median {int(med_qty):,}) but low stock ({stock:,} < median {int(med_stock):,})",
                })

            if sales > med_sales and profit < med_profit:
                high_sales_low_profit.append({
                    "sku_id": r["sku_id"],
                    "sku_name": r["sku_name"],
                    "category": r["category"],
                    "brand": r["brand"],
                    "total_sales_quantity": qty,
                    "total_revenue": round(sales, 2),
                    "total_profit": round(profit, 2),
                    "stock_on_hand": stock,
                    "reorder_point": int(r["reorder_point"]),
                    "safety_stock": int(r["safety_stock"]),
                    "reason": f"High revenue ({round(sales, 2):,} > median) but below median profit ({round(profit, 2):,}) - potential low margin or high discount",
                })

        # 2. Low stock inventory items (at store level)
        low_stock_query = text("""
            SELECT
                i.sku_id,
                sk.sku_name,
                sk.category,
                sk.brand,
                i.stock_on_hand,
                i.reorder_point,
                i.safety_stock,
                st.store_name
            FROM inventory i
            JOIN skus sk ON i.sku_id = sk.sku_id
            JOIN stores st ON i.store_id = st.store_id
            WHERE i.stock_on_hand < i.reorder_point
            ORDER BY (i.reorder_point - i.stock_on_hand) DESC
            LIMIT 50
        """)
        low_stock_rows = db.execute(low_stock_query).mappings().all()
        low_stock = [
            {
                "sku_id": r["sku_id"],
                "sku_name": r["sku_name"],
                "category": r["category"],
                "brand": r["brand"],
                "total_sales_quantity": None,
                "total_revenue": None,
                "total_profit": None,
                "stock_on_hand": int(r["stock_on_hand"]),
                "reorder_point": int(r["reorder_point"]),
                "safety_stock": int(r["safety_stock"]),
                "reason": f"Stock ({r['stock_on_hand']}) below reorder point ({r['reorder_point']}) at {r['store_name']}",
            }
            for r in low_stock_rows
        ]

        return {
            "high_sales_low_stock": high_sales_low_stock,
            "low_stock": low_stock,
            "high_sales_low_profit": high_sales_low_profit,
        }

    @staticmethod
    def get_pareto_analysis(db: Session, **filters) -> dict[str, Any]:
        """Calculates 80/20 Pareto principle on SKUs by total revenue."""
        where_clause, params = build_filter_clause(**filters)

        query = text(f"""
            SELECT
                sk.sku_id,
                sk.sku_name,
                sk.category,
                COALESCE(SUM(s.total_value), 0) AS revenue
            FROM skus sk
            JOIN sales s ON sk.sku_id = s.sku_id
            JOIN stores st ON s.store_id = st.store_id
            WHERE {where_clause}
            GROUP BY sk.sku_id, sk.sku_name, sk.category
            ORDER BY revenue DESC
        """)
        rows = db.execute(query, params).mappings().all()

        total_revenue = sum(float(r["revenue"]) for r in rows)
        cumulative = 0.0
        items = []
        top_80_count = 0

        for r in rows:
            rev = float(r["revenue"])
            cumulative += rev
            pct = (cumulative / total_revenue * 100) if total_revenue > 0 else 0.0
            is_top = pct <= 80.0 or (len(items) == 0 and total_revenue > 0)
            if is_top:
                top_80_count += 1
            items.append({
                "sku_id": r["sku_id"],
                "sku_name": r["sku_name"],
                "category": r["category"],
                "revenue": round(rev, 2),
                "cumulative_revenue": round(cumulative, 2),
                "cumulative_percentage": round(pct, 2),
                "is_top_80": is_top,
            })

        total_skus = len(items)
        top_pct = round((top_80_count / total_skus * 100), 2) if total_skus > 0 else 0.0

        return {
            "total_revenue": round(total_revenue, 2),
            "total_skus": total_skus,
            "top_80_skus_count": top_80_count,
            "top_80_skus_percentage": top_pct,
            "items": items,
        }
