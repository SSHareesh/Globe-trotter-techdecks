from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from landing.api.base import LandingAPIView
from landing.api.errors import error_response
from landing.providers.amadeus import search_cities, search_flights_offer
from landing.providers.pexels import search_image
from landing.providers.serpapi import search_hotels
from landing.services.cache import cache_get_or_set
from landing.services.http import UpstreamError, get_json


# Default popular destinations for Screen 3 initial load  
# Mix of Indian + international cities that work in Amadeus test environment
DEFAULT_DESTINATIONS = [
    {'name': 'Chennai', 'country': 'IN'},
    {'name': 'Mumbai', 'country': 'IN'},
    {'name': 'Bangalore', 'country': 'IN'},
    {'name': 'Delhi', 'country': 'IN'},
    {'name': 'Hyderabad', 'country': 'IN'},
    {'name': 'Kolkata', 'country': 'IN'},
    {'name': 'Goa', 'country': 'IN'},
    {'name': 'Jaipur', 'country': 'IN'},
    {'name': 'London', 'country': 'GB'},
    {'name': 'Paris', 'country': 'FR'},
    {'name': 'New York', 'country': 'US'},
    {'name': 'Singapore', 'country': 'SG'},
    {'name': 'Bangkok', 'country': 'TH'},
    {'name': 'DXB', 'country': 'AE'},  # Dubai airport code (test API limitation)
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
            search_query = q
            places = search_cities(search_query, limit=15, timeout_seconds=timeout)
            
            # If no results, try airport code mapping (Amadeus test API limitation workaround)
            if not places:
                airport_code_map = {
                    'dubai': ['DXB', 'DWC'],  # Dubai Int'l and Al Maktoum
                    'tokyo': ['TYO', 'NRT', 'HND'],  # Tokyo, Narita, Haneda
                    'madrid': ['MAD'],
                    'barcelona': ['BCN'],
                    'rome': ['FCO', 'CIA'],  # Fiumicino and Ciampino
                    'milan': ['MXP', 'LIN'],  # Malpensa and Linate
                    'sydney': ['SYD'],
                    'melbourne': ['MEL'],
                    'istanbul': ['IST'],
                    'moscow': ['MOW', 'SVO'],
                    'beijing': ['PEK'],
                    'shanghai': ['PVG', 'SHA'],
                }
                codes = airport_code_map.get(q.lower(), [])
                for code in codes:
                    places = search_cities(code, limit=15, timeout_seconds=timeout)
                    if places:
                        break
            
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
            
            # If we don't have 8 results and no specific search was done, fill with defaults
            # For actual searches, only fill if we got very few results (< 4)
            if len(results) < 8:
                # If it's a real search and we have at least 4 results, don't add defaults
                # This prevents mixing Dubai results with Indian cities
                if places and len(results) >= 4:
                    # Just return what we found, padded to 8 if needed
                    pass
                else:
                    # Either no results or very few - add some popular destinations
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
            
            return results  # Return what we found (may be less than 8 for specific searches)

        results, cached = cache_get_or_set('destinations', {'q': q}, ttl, compute)
        return Response({
            'cached': cached,
            'query': q,
            'results': results,
        })


class LandingAttractionsView(LandingAPIView):
    """Tourist attractions for a selected destination.

    Uses Wikipedia search + page thumbnails so it works worldwide without API keys.
    """

    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        city = (request.query_params.get('city') or request.query_params.get('q') or '').strip()
        if not city:
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_city',
                message='City is required. Provide ?city=...'
            )

        timeout = getattr(settings, 'OUTBOUND_HTTP_TIMEOUT_SECONDS', 6.0)
        ttl = int(getattr(settings, 'CACHES', {}).get('default', {}).get('TIMEOUT', 3600) or 3600)
        limit = int(request.query_params.get('limit') or 18)
        limit = max(6, min(limit, 40))

        def compute():
            search = f"tourist attractions in {city}"
            url = (
                "https://en.wikipedia.org/w/api.php"
                "?action=query"
                "&format=json"
                "&origin=*"
                "&generator=search"
                f"&gsrsearch={search.replace(' ', '%20')}"
                f"&gsrlimit={limit}"
                "&gsrnamespace=0"
                "&prop=pageimages%7Cextracts%7Cdescription"
                "&piprop=thumbnail"
                "&pithumbsize=400"
                "&exintro=1"
                "&explaintext=1"
                "&exsentences=2"
                "&redirects=1"
            )

            resp = get_json(url, timeout_seconds=timeout)
            data = resp.data or {}
            pages = (data.get('query') or {}).get('pages') or {}

            out = []
            city_lower = city.lower()
            for page in pages.values():
                title = (page.get('title') or '').strip()
                if not title:
                    continue
                if title.lower() == city_lower:
                    continue

                title_lower = title.lower()
                if title_lower.startswith('lists of tourist attractions'):
                    continue

                thumb = (page.get('thumbnail') or {}).get('source')
                extract = (page.get('extract') or '').strip()
                desc = (page.get('description') or '').strip()
                pageid = page.get('pageid')

                # Keep results relevant to the selected destination.
                extract_lower = extract.lower() if extract else ''
                if city_lower not in title_lower and city_lower not in extract_lower:
                    continue

                out.append({
                    'name': title,
                    'description': extract or desc or '',
                    'image_url': thumb,
                    'source': 'wikipedia',
                    'source_url': f"https://en.wikipedia.org/?curid={pageid}" if pageid else None,
                })

            return out[:limit]

        results, cached = cache_get_or_set('attractions', {'city': city, 'limit': limit, 'v': 2}, ttl, compute)
        return Response({
            'cached': cached,
            'city': city,
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


class TripSearchFlightsView(LandingAPIView):
    """Fetch flight offers for a trip."""
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        origin = request.query_params.get('origin')
        destination = request.query_params.get('destination')
        departure_date = request.query_params.get('departure_date')
        return_date = request.query_params.get('return_date')

        if not all([origin, destination, departure_date]):
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_params',
                message='origin, destination, and departure_date are required.'
            )

        flights = search_flights_offer(
            origin_code=origin,
            destination_code=destination,
            departure_date=departure_date,
            return_date=return_date
        )
        return Response({'results': flights})


class TripSearchHotelsView(LandingAPIView):
    """Fetch hotel options for a destination."""
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def get(self, request):
        city = request.query_params.get('city')
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')

        if not all([city, check_in, check_out]):
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_params',
                message='city, check_in, and check_out are required.'
            )

        hotels = search_hotels(
            city_name=city,
            check_in_date=check_in,
            check_out_date=check_out
        )
        return Response({'results': hotels})


class TripAIEnhanceView(LandingAPIView):
    """Enhance a trip itinerary using AI."""
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)
    
    def post(self, request):
        from landing.providers.groq import generate_itinerary_enhancement
        
        destination = request.data.get('destination')
        duration = request.data.get('duration')
        current_activities = request.data.get('activities', [])
        hotel = request.data.get('hotel')
        
        if not destination or not duration:
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_params',
                message='destination and duration are required.'
            )
            
        try:
            enhanced_days = generate_itinerary_enhancement(
                destination=destination,
                duration=int(duration),
                current_activities=current_activities,
                hotel=hotel
            )
            return Response({'days': enhanced_days})
        except Exception as e:
            return error_response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code='ai_failed',
                message=str(e)
            )

class ChatBotView(LandingAPIView):
    """General AI chatbot for travel assistance."""
    permission_classes = (AllowAny,)
    throttle_classes = (AnonRateThrottle,)

    def post(self, request):
        from landing.providers.groq import chat_with_ai
        
        message = request.data.get('message')
        history = request.data.get('history', [])
        
        if not message:
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='missing_message',
                message='Message is required.'
            )
            
        try:
            result = chat_with_ai(message=message, history=history)
            # result is now a dict with 'response' and optional 'data'
            return Response(result)
        except Exception as e:
            return error_response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code='chat_failed',
                message=str(e)
            )
