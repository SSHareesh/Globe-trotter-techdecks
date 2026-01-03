from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from landing.api.base import LandingAPIView
from landing.api.errors import error_response
from landing.providers.amadeus import search_cities
from landing.providers.pexels import search_image
from landing.services.cache import cache_get_or_set
from landing.services.http import UpstreamError


# Default popular destinations for Screen 3 initial load (Indian cities)
DEFAULT_DESTINATIONS = [
    {'name': 'Chennai', 'country': 'IN'},
    {'name': 'Mumbai', 'country': 'IN'},
    {'name': 'Bangalore', 'country': 'IN'},
    {'name': 'Delhi', 'country': 'IN'},
    {'name': 'Hyderabad', 'country': 'IN'},
    {'name': 'Kolkata', 'country': 'IN'},
    {'name': 'Goa', 'country': 'IN'},
    {'name': 'Jaipur', 'country': 'IN'},
]


class LandingHealthView(LandingAPIView):
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        return Response({'status': 'ok'})


class LandingConfigView(LandingAPIView):
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        # Do not expose keys; just report which integrations are configured.
        env = getattr(settings, 'LANDING_INTEGRATIONS', {})
        return Response({
            'integrations': env,
        })


class LandingTrendingView(LandingAPIView):
    """Screen 3: Default trending/popular destinations shown on page load."""

    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        timeout = getattr(settings, 'OUTBOUND_HTTP_TIMEOUT_SECONDS', 6.0)
        ttl = int(getattr(settings, 'CACHES', {}).get('default', {}).get('TIMEOUT', 3600) or 3600)
        limit = int(request.query_params.get('limit') or 8)
        limit = max(4, min(limit, 12))

        def compute():
            results = []
            for dest in DEFAULT_DESTINATIONS[:limit]:
                try:
                    # Search for the city to get proper Amadeus data
                    places = search_cities(dest['name'], limit=1, timeout_seconds=timeout)
                    if places:
                        p = places[0]
                        image_query = f"{p.name} {p.country or ''} travel".strip()
                        try:
                            img = search_image(image_query, timeout_seconds=timeout)
                        except UpstreamError:
                            img = None
                        results.append({
                            'provider': 'amadeus',
                            'provider_place_id': p.provider_place_id,
                            'name': p.name,
                            'country': p.country,
                            'lat': p.lat,
                            'lon': p.lon,
                            'image_url': img.url if img else None,
                            'image_source': 'pexels' if img else None,
                        })
                except Exception:
                    # Skip if city lookup fails
                    continue
            return results

        results, cached = cache_get_or_set('trending', {'limit': limit}, ttl, compute)
        return Response({
            'cached': cached,
            'results': results,
        })


class LandingBannerView(LandingAPIView):
    """Screen 3: Banner image for the main landing page."""

    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        timeout = getattr(settings, 'OUTBOUND_HTTP_TIMEOUT_SECONDS', 6.0)
        ttl = int(getattr(settings, 'CACHES', {}).get('default', {}).get('TIMEOUT', 3600) or 3600)

        query = request.query_params.get('q') or 'travel landscape'

        def compute():
            try:
                img = search_image(query, timeout_seconds=timeout)
            except UpstreamError:
                img = None
            return {
                'query': query,
                'image_url': img.url if img else None,
                'source': 'pexels' if img else None,
            }

        payload, cached = cache_get_or_set('banner', {'q': query}, ttl, compute)
        return Response({
            'cached': cached,
            'banner': payload,
        })


class LandingDestinationsView(LandingAPIView):
    """Screen 3: Destination discovery list (no dummy data).

    Frontend should call this based on user input (search bar) to get real destinations.
    """

    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        q = (request.query_params.get('q') or '').strip()
        if not q:
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_query',
                message='Search query is required. Please enter a city or destination name.',
            )

        integrations = getattr(settings, 'LANDING_INTEGRATIONS', {})
        if not integrations.get('amadeus'):
            return error_response(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                code='service_unavailable',
                message='Destination search is temporarily unavailable. Please try again later.',
            )

        # Always return 8 destinations: searched city first + 7 others
        limit = 8

        timeout = getattr(settings, 'OUTBOUND_HTTP_TIMEOUT_SECONDS', 6.0)
        ttl = int(getattr(settings, 'CACHES', {}).get('default', {}).get('TIMEOUT', 3600) or 3600)

        def compute():
            # Search for up to 15 destinations to have options
            places = search_cities(q, limit=15, timeout_seconds=timeout)
            
            # Helper to convert place to result dict
            def place_to_result(p):
                image_query = f"{p.name} {p.country or ''} travel".strip()
                try:
                    img = search_image(image_query, timeout_seconds=timeout)
                except UpstreamError:
                    img = None
                return {
                    'provider': 'amadeus',
                    'provider_place_id': p.provider_place_id,
                    'name': p.name,
                    'country': p.country,
                    'lat': p.lat,
                    'lon': p.lon,
                    'image_url': img.url if img else None,
                    'image_source': 'pexels' if img else None,
                }
            
            results = []
            search_lower = q.lower()
            
            # Find the best match (exact or starts with)
            best_match = None
            other_matches = []
            
            for p in places:
                result = place_to_result(p)
                name_lower = p.name.lower()
                
                if not best_match and (name_lower == search_lower or name_lower.startswith(search_lower)):
                    best_match = result
                else:
                    other_matches.append(result)
            
            # Start with the best match
            if best_match:
                results.append(best_match)
            
            # Add other search results
            results.extend(other_matches[:7 if best_match else 8])
            
            # If we don't have 8 results, fill with default Indian cities
            if len(results) < 8:
                needed = 8 - len(results)
                existing_names = {r['name'].lower() for r in results}
                
                for default_dest in DEFAULT_DESTINATIONS:
                    if needed <= 0:
                        break
                    if default_dest['name'].lower() not in existing_names:
                        try:
                            default_places = search_cities(default_dest['name'], limit=1, timeout_seconds=timeout)
                            if default_places:
                                results.append(place_to_result(default_places[0]))
                                needed -= 1
                        except Exception:
                            continue
            
            return results[:8]  # Ensure exactly 8 results

        results, cached = cache_get_or_set('destinations', {'q': q}, ttl, compute)
        return Response({
            'cached': cached,
            'query': q,
            'results': results,
        })


class LandingHomeView(LandingAPIView):
    """Screen 3: Main landing page payload (banner + optional destinations).

    No dummy destinations: we only return destinations if a query is provided.
    """

    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        banner_query = request.query_params.get('banner_q') or 'travel landscape'
        q = (request.query_params.get('q') or '').strip()

        timeout = getattr(settings, 'OUTBOUND_HTTP_TIMEOUT_SECONDS', 6.0)
        ttl = int(getattr(settings, 'CACHES', {}).get('default', {}).get('TIMEOUT', 3600) or 3600)

        def compute_banner():
            try:
                img = search_image(banner_query, timeout_seconds=timeout)
            except UpstreamError:
                img = None
            return {
                'query': banner_query,
                'image_url': img.url if img else None,
                'source': 'pexels' if img else None,
            }

        banner, banner_cached = cache_get_or_set('home_banner', {'q': banner_query}, ttl, compute_banner)

        destinations = []
        destinations_cached = False
        if q:
            integrations = getattr(settings, 'LANDING_INTEGRATIONS', {})
            if not integrations.get('amadeus'):
                return error_response(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    code='service_unavailable',
                    message='Destination search is temporarily unavailable. Please try again later.',
                )

            def compute_destinations():
                places = search_cities(q, limit=6, timeout_seconds=timeout)
                out = []
                for p in places:
                    image_query = f"{p.name} {p.country or ''} travel".strip()
                    try:
                        img = search_image(image_query, timeout_seconds=timeout)
                    except UpstreamError:
                        img = None
                    out.append({
                        'provider': 'amadeus',
                        'provider_place_id': p.provider_place_id,
                        'name': p.name,
                        'country': p.country,
                        'lat': p.lat,
                        'lon': p.lon,
                        'image_url': img.url if img else None,
                        'image_source': 'pexels' if img else None,
                    })
                return out

            destinations, destinations_cached = cache_get_or_set('home_destinations', {'q': q}, ttl, compute_destinations)

        return Response({
            'banner': banner,
            'banner_cached': banner_cached,
            'destinations': destinations,
            'destinations_cached': destinations_cached,
        })
