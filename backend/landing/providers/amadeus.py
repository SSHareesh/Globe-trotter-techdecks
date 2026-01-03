from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import urlencode

from decouple import config
from django.core.cache import cache

from landing.services.http import UpstreamError, get_json, post_form


# Use test API by default (production requires Amadeus approval + live credentials)
AMADEUS_BASE = config('AMADEUS_API_BASE', default='https://test.api.amadeus.com/v1')
_TOKEN_CACHE_KEY = 'amadeus:oauth:access_token:v2'


@dataclass(frozen=True)
class AmadeusCity:
    provider_place_id: str
    name: str
    country: str | None
    lat: float | None
    lon: float | None
    raw: Any


@dataclass(frozen=True)
class AmadeusFlightSearch:
    id: str
    itineraries: list[dict]
    price: dict
    validating_airline_codes: list[str]
    raw: Any


def _client_id() -> str:
    return config('AMADEUS_CLIENT_ID', default='')


def _client_secret() -> str:
    return config('AMADEUS_CLIENT_SECRET', default='')


def _get_access_token(*, timeout_seconds: float = 6.0, force_refresh: bool = False) -> str:
    if not force_refresh:
        cached = cache.get(_TOKEN_CACHE_KEY)
        if isinstance(cached, str) and cached:
            return cached

    client_id = _client_id()
    client_secret = _client_secret()
    if not client_id or not client_secret:
        raise UpstreamError('Amadeus is not configured', status=503)

    # OAuth token endpoint (note: uses /security/ not /v1/security/)
    url = f'{AMADEUS_BASE.rsplit("/v1", 1)[0]}/v1/security/oauth2/token'
    
    try:
        resp = post_form(
            url,
            form={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret,
            },
            timeout_seconds=timeout_seconds,
        )
    except UpstreamError as e:
        raise UpstreamError(
            'Amadeus OAuth failed - check AMADEUS_CLIENT_ID/SECRET are valid',
            status=e.status or 503,
            details=e.details,
        ) from e

    token = (resp.data or {}).get('access_token')
    expires_in = (resp.data or {}).get('expires_in')

    if not token:
        raise UpstreamError(
            'Amadeus token missing - credentials may be invalid',
            status=502,
            details=resp.data,
        )

    try:
        expires_seconds = int(expires_in) if expires_in is not None else 900
    except Exception:
        expires_seconds = 900

    # Keep a small buffer so we don't use an almost-expired token.
    cache.set(_TOKEN_CACHE_KEY, str(token), timeout=max(30, expires_seconds - 30))
    return str(token)


def search_cities(keyword: str, *, limit: int = 6, timeout_seconds: float = 6.0) -> list[AmadeusCity]:
    """Search for cities using Amadeus reference data (real data, no dummy).

    Uses the Amadeus test environment endpoint.
    """

    token = _get_access_token(timeout_seconds=timeout_seconds)

    def do_request(access_token: str) -> Any:
        params = {
            # In the Amadeus test environment, CITY-only can be sparse for some queries.
            # Including AIRPORT keeps Screen 3 search results useful (still real data).
            'subType': 'CITY,AIRPORT',
            'keyword': keyword,
            'page[limit]': limit,
        }
        url = f"{AMADEUS_BASE}/reference-data/locations?{urlencode(params)}"
        resp = get_json(
            url,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout_seconds=timeout_seconds,
        )
        return resp.data

    try:
        data = do_request(token)
    except UpstreamError as e:
        # If token expired/invalid, refresh once and retry.
        if e.status in (401, 403):
            token = _get_access_token(timeout_seconds=timeout_seconds, force_refresh=True)
            data = do_request(token)
        else:
            raise

    items = (data or {}).get('data', [])
    out: list[AmadeusCity] = []
    for item in items:
        name = (item or {}).get('name')
        geo = (item or {}).get('geoCode', {})
        address = (item or {}).get('address', {})

        provider_place_id = (
            (item or {}).get('iataCode')
            or (item or {}).get('id')
            or ''
        )

        if not provider_place_id or not name:
            continue

        lat = geo.get('latitude')
        lon = geo.get('longitude')
        country_code = address.get('countryCode')

        out.append(
            AmadeusCity(
                provider_place_id=str(provider_place_id),
                name=str(name),
                country=str(country_code) if country_code else None,
                lat=float(lat) if lat is not None else None,
                lon=float(lon) if lon is not None else None,
                raw=item,
            )
        )

    return out


def search_flights_offer(
    origin_code: str,
    destination_code: str,
    departure_date: str,
    return_date: Optional[str] = None,
    adults: int = 1,
    limit: int = 5,
    timeout_seconds: float = 20.0
) -> list[dict]:
    """Search for flight offers using Amadeus Flight Offers Search API.
    
    API docs: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search/api-reference
    """
    token = _get_access_token(timeout_seconds=timeout_seconds)
    
    def do_request(access_token: str) -> Any:
        # Note: Amadeus Flight Offers Search uses v2 base
        base_v2 = AMADEUS_BASE.replace('/v1', '/v2')
        params = {
            'originLocationCode': origin_code,
            'destinationLocationCode': destination_code,
            'departureDate': departure_date,
            'adults': adults,
            'max': limit,
            'currencyCode': 'USD',
        }
        if return_date:
            params['returnDate'] = return_date
            
        url = f"{base_v2}/shopping/flight-offers?{urlencode(params)}"
        resp = get_json(
            url,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout_seconds=timeout_seconds,
        )
        return resp.data

    try:
        data = do_request(token)
    except UpstreamError as e:
        if e.status in (401, 403):
            token = _get_access_token(timeout_seconds=timeout_seconds, force_refresh=True)
            data = do_request(token)
        else:
            raise

    return (data or {}).get('data', [])
