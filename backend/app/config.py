"""Application configuration using pydantic-settings."""

from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    DATABASE_URL: str
    DATABASE_URL_DIRECT: str = ""  # For migrations (direct, non-pooled)

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def migration_database_url(self) -> str:
        """Return the direct (non-pooled) URL for migrations, falling back to DATABASE_URL."""
        return self.DATABASE_URL_DIRECT or self.DATABASE_URL


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings. Raises a clear error if DATABASE_URL is missing."""
    try:
        return Settings()  # type: ignore[call-arg]
    except Exception as e:
        raise RuntimeError(
            "Failed to load settings. Ensure backend/.env exists with a valid DATABASE_URL. "
            "Copy .env.example to .env and fill in your Neon connection string."
        ) from e
