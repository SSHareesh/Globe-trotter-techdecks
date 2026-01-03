from __future__ import annotations

import hashlib
import json
from typing import Any

from django.core.cache import cache


def _key(prefix: str, payload: Any, version: str = 'v2') -> str:
    """Generate cache key with version to invalidate old data after provider changes."""
    raw = json.dumps(payload, sort_keys=True, default=str).encode('utf-8')
    digest = hashlib.sha256(raw).hexdigest()[:16]
    return f"landing:{version}:{prefix}:{digest}"


def cache_get_or_set(prefix: str, payload: Any, ttl_seconds: int, compute, version: str = 'v2'):
    """Cache helper with versioning to prevent stale data."""
    key = _key(prefix, payload, version=version)
    existing = cache.get(key)
    if existing is not None:
        return existing, True

    value = compute()
    cache.set(key, value, timeout=ttl_seconds)
    return value, False
