"""SQLAlchemy ORM models for the Retail Analytics database.

Tables:
- stores: Physical store locations (50 stores across Dubai, Abu Dhabi, Sharjah)
- skus: Product catalog (200 SKUs across 7 categories, 5 brands)
- sales: Transaction records (641K+ rows, 2021 onwards)
- inventory: Stock snapshots per store per SKU (composite PK: store_id, sku_id, snapshot_date)
"""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    String,
    Integer,
    Numeric,
    Date,
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Store(Base):
    """Physical retail store."""

    __tablename__ = "stores"

    store_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_name: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    store_type: Mapped[str] = mapped_column(String(50), nullable=False)
    opening_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # Relationships
    sales: Mapped[list["Sale"]] = relationship(back_populates="store")
    inventory_records: Mapped[list["Inventory"]] = relationship(back_populates="store")

    def __repr__(self) -> str:
        return f"<Store {self.store_id}: {self.store_name}>"


class SKU(Base):
    """Product / Stock Keeping Unit."""

    __tablename__ = "skus"

    sku_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sku_name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    subcategory: Mapped[str] = mapped_column(String(50), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    cost_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    brand: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # Relationships
    sales: Mapped[list["Sale"]] = relationship(back_populates="sku")
    inventory_records: Mapped[list["Inventory"]] = relationship(back_populates="sku")

    def __repr__(self) -> str:
        return f"<SKU {self.sku_id}: {self.sku_name}>"


class Sale(Base):
    """Individual sales transaction line."""

    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    store_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("stores.store_id"), nullable=False, index=True
    )
    sku_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skus.sku_id"), nullable=False, index=True
    )
    customer_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_value: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    channel: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    discount_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)

    # Relationships
    store: Mapped["Store"] = relationship(back_populates="sales")
    sku: Mapped["SKU"] = relationship(back_populates="sales")

    __table_args__ = (
        Index("ix_sales_date_store", "date", "store_id"),
        Index("ix_sales_date_sku", "date", "sku_id"),
    )

    def __repr__(self) -> str:
        return f"<Sale {self.id}: {self.date} sku={self.sku_id} qty={self.quantity}>"


class Inventory(Base):
    """Inventory snapshot for a store-SKU pair on a given date."""

    __tablename__ = "inventory"

    store_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("stores.store_id"), primary_key=True
    )
    sku_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skus.sku_id"), primary_key=True
    )
    snapshot_date: Mapped[date] = mapped_column(Date, primary_key=True)
    stock_on_hand: Mapped[int] = mapped_column(Integer, nullable=False)
    reorder_point: Mapped[int] = mapped_column(Integer, nullable=False)
    safety_stock: Mapped[int] = mapped_column(Integer, nullable=False)
    last_restock_date: Mapped[date] = mapped_column(Date, nullable=False)

    # Relationships
    store: Mapped["Store"] = relationship(back_populates="inventory_records")
    sku: Mapped["SKU"] = relationship(back_populates="inventory_records")

    __table_args__ = (
        UniqueConstraint("store_id", "sku_id", "snapshot_date", name="uq_inventory_snapshot"),
    )

    def __repr__(self) -> str:
        return f"<Inventory store={self.store_id} sku={self.sku_id} date={self.snapshot_date}>"
