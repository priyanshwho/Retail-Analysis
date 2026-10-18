"""FastAPI Application Entry Point for Retail Analytics Dashboard."""

from datetime import datetime
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.schemas import HealthResponse
from app.routers import dashboard, analytics, explorer

settings = get_settings()

app = FastAPI(
    title="Retail Analytics Dashboard API",
    description="High-performance retail business analytics, KPI aggregations, risk analysis, and inventory monitoring.",
    version="1.0.0",
)

# CORS setup
origins = settings.cors_origins_list
if "http://localhost:5173" not in origins:
    origins.append("http://localhost:5173")
if "http://127.0.0.1:5173" not in origins:
    origins.append("http://127.0.0.1:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(explorer.router)


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint that verifies database connectivity and table counts."""
    counts = {}
    for table in ["stores", "skus", "inventory", "sales"]:
        count = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar() or 0
        counts[table] = count

    return {
        "status": "ok",
        "database": "connected",
        "timestamp": datetime.utcnow(),
        "counts": counts,
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Retail Analytics API is online",
        "docs": "/docs",
        "health": "/api/health",
    }
