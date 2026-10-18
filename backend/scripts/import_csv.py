"""Idempotent CSV import script for Retail Analytics.

Loads data from CSV files into Neon PostgreSQL in correct FK order:
1. stores (50 rows)
2. skus (200 rows)
3. inventory (8,735 rows)
4. sales (641,844 rows)

Uses psycopg3 COPY for fast streaming inserts of sales data.
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

import pandas as pd
from sqlalchemy import text

# Ensure backend package can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import engine  # noqa: E402


def get_default_dataset_dir() -> Path:
    """Locate the dataset directory."""
    candidates = [
        Path(__file__).resolve().parent.parent.parent / "retail-analysis" / "dataset",
        Path(__file__).resolve().parent.parent.parent / "retail-analysis",
        Path.cwd() / "retail-analysis" / "dataset",
    ]
    for c in candidates:
        if (c / "bm_stores.csv").exists():
            return c
    raise FileNotFoundError(f"Could not locate dataset directory. Checked: {candidates}")


def get_table_count(conn, table_name: str) -> int:
    """Return the current row count for a given table."""
    result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
    return result.scalar() or 0


def import_stores(dataset_dir: Path, force: bool = False) -> None:
    csv_path = dataset_dir / "bm_stores.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    with engine.begin() as conn:
        count = get_table_count(conn, "stores")
        if count > 0 and not force:
            print(f"✓ stores already populated ({count} rows). Skipping (use --force to reload).")
            return

        if force and count > 0:
            print(f"Clearing stores table...")
            conn.execute(text("TRUNCATE TABLE stores CASCADE"))

        print(f"Reading {csv_path.name}...")
        df = pd.read_csv(csv_path)
        df["opening_date"] = pd.to_datetime(df["opening_date"])

        records = [
            (
                int(row["store_id"]),
                str(row["store_name"]).strip(),
                str(row["city"]).strip(),
                str(row["store_type"]).strip(),
                row["opening_date"].to_pydatetime(),
            )
            for _, row in df.iterrows()
        ]

        raw_conn = conn.connection
        with raw_conn.cursor() as cur:
            with cur.copy(
                "COPY stores (store_id, store_name, city, store_type, opening_date) FROM STDIN"
            ) as copy:
                for row in records:
                    copy.write_row(row)

        print(f"✓ Imported {len(records)} stores.")


def import_skus(dataset_dir: Path, force: bool = False) -> None:
    csv_path = dataset_dir / "bm_skus.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    with engine.begin() as conn:
        count = get_table_count(conn, "skus")
        if count > 0 and not force:
            print(f"✓ skus already populated ({count} rows). Skipping (use --force to reload).")
            return

        if force and count > 0:
            print(f"Clearing skus table...")
            conn.execute(text("TRUNCATE TABLE skus CASCADE"))

        print(f"Reading {csv_path.name}...")
        df = pd.read_csv(csv_path)

        records = [
            (
                int(row["sku_id"]),
                str(row["sku_name"]).strip(),
                str(row["category"]).strip(),
                str(row["subcategory"]).strip(),
                float(row["unit_price"]),
                float(row["cost_price"]),
                str(row["brand"]).strip(),
            )
            for _, row in df.iterrows()
        ]

        raw_conn = conn.connection
        with raw_conn.cursor() as cur:
            with cur.copy(
                "COPY skus (sku_id, sku_name, category, subcategory, unit_price, cost_price, brand) FROM STDIN"
            ) as copy:
                for row in records:
                    copy.write_row(row)

        print(f"✓ Imported {len(records)} skus.")


def import_inventory(dataset_dir: Path, force: bool = False) -> None:
    csv_path = dataset_dir / "bm_inventory.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    with engine.begin() as conn:
        count = get_table_count(conn, "inventory")
        if count > 0 and not force:
            print(f"✓ inventory already populated ({count} rows). Skipping (use --force to reload).")
            return

        if force and count > 0:
            print(f"Clearing inventory table...")
            conn.execute(text("TRUNCATE TABLE inventory CASCADE"))

        print(f"Reading {csv_path.name}...")
        df = pd.read_csv(csv_path)
        df["last_restock_date"] = pd.to_datetime(df["last_restock_date"]).dt.date
        df["snapshot_date"] = pd.to_datetime(df["snapshot_date"]).dt.date

        records = [
            (
                int(row["store_id"]),
                int(row["sku_id"]),
                int(row["stock_on_hand"]),
                int(row["reorder_point"]),
                int(row["safety_stock"]),
                row["last_restock_date"],
                row["snapshot_date"],
            )
            for _, row in df.iterrows()
        ]

        raw_conn = conn.connection
        with raw_conn.cursor() as cur:
            with cur.copy(
                "COPY inventory (store_id, sku_id, stock_on_hand, reorder_point, safety_stock, last_restock_date, snapshot_date) FROM STDIN"
            ) as copy:
                for row in records:
                    copy.write_row(row)

        print(f"✓ Imported {len(records)} inventory records.")


def import_sales(dataset_dir: Path, force: bool = False, chunksize: int = 100_000) -> None:
    csv_path = dataset_dir / "bm_sales.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    with engine.begin() as conn:
        count = get_table_count(conn, "sales")
        if count > 0 and not force:
            print(f"✓ sales already populated ({count} rows). Skipping (use --force to reload).")
            return

        if force and count > 0:
            print(f"Clearing sales table...")
            conn.execute(text("TRUNCATE TABLE sales CASCADE"))

    print(f"Reading and importing {csv_path.name} in chunks of {chunksize:,}...")
    total_imported = 0
    start_time = time.time()

    # Stream chunks from CSV to keep memory low
    for chunk_idx, chunk in enumerate(pd.read_csv(csv_path, chunksize=chunksize), start=1):
        chunk["date"] = pd.to_datetime(chunk["date"]).dt.date

        records = []
        for _, row in chunk.iterrows():
            customer_id = int(row["customer_id"]) if pd.notna(row["customer_id"]) else None
            discount_pct = float(row["discount_pct"]) if pd.notna(row["discount_pct"]) else None
            records.append(
                (
                    row["date"],
                    int(row["store_id"]),
                    int(row["sku_id"]),
                    customer_id,
                    int(row["quantity"]),
                    float(row["unit_price"]),
                    float(row["total_value"]),
                    str(row["channel"]).strip(),
                    discount_pct,
                )
            )

        with engine.begin() as conn:
            raw_conn = conn.connection
            with raw_conn.cursor() as cur:
                with cur.copy(
                    "COPY sales (date, store_id, sku_id, customer_id, quantity, unit_price, total_value, channel, discount_pct) FROM STDIN"
                ) as copy:
                    for row in records:
                        copy.write_row(row)

        total_imported += len(records)
        elapsed = time.time() - start_time
        print(f"  Chunk {chunk_idx}: {total_imported:,} rows imported ({elapsed:.1f}s)")

    print(f"✓ Imported {total_imported:,} sales records in {time.time() - start_time:.1f}s.")


def main():
    parser = argparse.ArgumentParser(description="Import retail CSV datasets into PostgreSQL.")
    parser.add_argument("--dataset-dir", type=str, default=None, help="Path to dataset directory containing CSVs")
    parser.add_argument("--force", action="store_true", help="Truncate tables and re-import data")
    args = parser.parse_args()

    dataset_dir = Path(args.dataset_dir) if args.dataset_dir else get_default_dataset_dir()
    print(f"Using dataset directory: {dataset_dir}")
    print(f"Force reload: {args.force}")

    t0 = time.time()
    import_stores(dataset_dir, force=args.force)
    import_skus(dataset_dir, force=args.force)
    import_inventory(dataset_dir, force=args.force)
    import_sales(dataset_dir, force=args.force)

    print(f"\n🎉 All imports completed in {time.time() - t0:.1f}s!")


if __name__ == "__main__":
    main()
