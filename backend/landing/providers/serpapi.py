from __future__ import annotations
from typing import Any
from urllib.parse import urlencode
from decouple import config
from landing.services.http import UpstreamError, get_json

def _api_key() -> str:
    return config('SERPAPI_KEY', default='')

def search_hotels(city_name: str, check_in_date: str, check_out_date: str, timeout_seconds: float = 20.0) -> list[dict]:
    """Search for hotels using SerpApi's Google Hotels engine.
    
    API docs: https://serpapi.com/google-hotels-api
    """
    api_key = _api_key()
    if not api_key:
        raise UpstreamError('SerpApi (Google Hotels) is not configured', status=503)

    params = {
        'engine': 'google_hotels',
        'q': f'hotels in {city_name}',
        'check_in_date': check_in_date,
        'check_out_date': check_out_date,
        'api_key': api_key,
        'hl': 'en',
        'gl': 'in',
        'currency': 'INR',
    }
    
    url = f"https://serpapi.com/search?{urlencode(params)}"
    
    try:
        resp = get_json(url, timeout_seconds=timeout_seconds)
        data = resp.data or {}
        # SerpApi returns results in 'properties' key for google_hotels
        return data.get('properties', [])[:6]
    except Exception as e:
        raise UpstreamError(f"Hotel search failed: {str(e)}", status=502)
