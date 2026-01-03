from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

from decouple import config

from landing.services.http import get_json


GEOAPIFY_BASE = 'https://api.geoapify.com/v1'


@dataclass(frozen=True)
class GeoapifyPlace:
    provider_place_id: str
    name: str
    country: str | None
    lat: float | None
    lon: float | None
    raw: Any


def _api_key() -> str:
    return config('GEOAPIFY_API_KEY', default='')


def autocomplete_cities(text: str, *, limit: int = 6, timeout_seconds: float = 6.0) -> list[GeoapifyPlace]:
    key = _api_key()
    params = {
        'text': text,
        'type': 'city',
        'limit': limit,
        'apiKey': key,
    }
    url = f"{GEOAPIFY_BASE}/geocode/autocomplete?{urlencode(params)}"
    resp = get_json(url, timeout_seconds=timeout_seconds)
    features = (resp.data or {}).get('features', [])

    places: list[GeoapifyPlace] = []
    for feature in features:
        props = (feature or {}).get('properties', {})
        provider_place_id = str(props.get('place_id') or props.get('place_id') or '')
        name = (
            props.get('city')
            or props.get('name')
            or props.get('formatted')
            or text
        )
        country = props.get('country')
        lat = props.get('lat')
        lon = props.get('lon')

        if provider_place_id:
            places.append(
                GeoapifyPlace(
                    provider_place_id=provider_place_id,
                    name=str(name),
                    country=str(country) if country is not None else None,
                    lat=float(lat) if lat is not None else None,
                    lon=float(lon) if lon is not None else None,
                    raw=feature,
                )
            )

    return places
