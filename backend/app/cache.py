"""In-memory thread-safe TTL cache for high-performance retail analytics."""

from __future__ import annotations

import time
import threading
from typing import Any


class TTLCache:
    def __init__(self, default_ttl: int = 300):
        self.default_ttl = default_ttl
        self._cache: dict[str, tuple[float, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Any | None:
        with self._lock:
            if key in self._cache:
                expiry, val = self._cache[key]
                if time.time() < expiry:
                    return val
                del self._cache[key]
            return None

    def set(self, key: str, val: Any, ttl: int | None = None) -> None:
        with self._lock:
            expiry = time.time() + (ttl if ttl is not None else self.default_ttl)
            self._cache[key] = (expiry, val)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()


cache = TTLCache(default_ttl=300)
