from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

from decouple import config

from landing.services.http import get_json


PEXELS_BASE = 'https://api.pexels.com/v1'


@dataclass(frozen=True)
class PexelsImage:
    url: str
    photographer: str | None
    raw: Any


def _api_key() -> str:
    return config('PEXELS_API_KEY', default='')


def search_image(query: str, *, per_page: int = 1, timeout_seconds: float = 6.0) -> PexelsImage | None:
    key = _api_key()
    if not key:
        return None

    params = {
        'query': query,
        'per_page': per_page,
        'orientation': 'landscape',
        'size': 'large',
    }
    url = f"{PEXELS_BASE}/search?{urlencode(params)}"
    resp = get_json(url, headers={'Authorization': key}, timeout_seconds=timeout_seconds)
    photos = (resp.data or {}).get('photos', [])
    if not photos:
        return None

    photo = photos[0]
    src = (photo or {}).get('src', {})
    image_url = src.get('landscape') or src.get('large') or src.get('original')
    if not image_url:
        return None

    return PexelsImage(
        url=str(image_url),
        photographer=str((photo or {}).get('photographer')) if (photo or {}).get('photographer') else None,
        raw=photo,
    )
