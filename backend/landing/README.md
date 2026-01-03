# Landing Page API (Screen 3)

Professional backend implementation for the Globe Trotter main landing page with real-time destination search and banner imagery.

## Features

✅ **Real-Time Destination Search** - Powered by Amadeus API with city and airport data  
✅ **Dynamic Banner Images** - Pexels API integration for high-quality travel photography  
✅ **Smart Caching** - Versioned cache system with configurable TTL  
✅ **Rate Limiting** - DRF throttling (60/min anon, 120/min auth)  
✅ **Error Resilience** - Graceful degradation when providers are unavailable  
✅ **Professional Error Messages** - User-friendly responses for all error cases

## API Endpoints

### `GET /api/v1/landing/health/`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### `GET /api/v1/landing/config/`
Returns configured integrations (boolean flags, no secrets).

**Response:**
```json
{
  "integrations": {
    "amadeus": true,
    "pexels": true,
    ...
  }
}
```

### `GET /api/v1/landing/banner/?q=<query>`
Fetch hero banner image from Pexels.

**Parameters:**
- `q` (optional): Search query, defaults to "travel landscape"

**Response:**
```json
{
  "cached": false,
  "banner": {
    "query": "travel landscape",
    "image_url": "https://images.pexels.com/...",
    "source": "pexels"
  }
}
```

### `GET /api/v1/landing/destinations/?q=<query>&limit=<num>`
Search destinations using Amadeus city/airport API with Pexels images.

**Parameters:**
- `q` (required): Search query (city name, airport code, etc.)
- `limit` (optional): Results limit (1-12, default 6)

**Response:**
```json
{
  "cached": false,
  "query": "paris",
  "results": [
    {
      "provider": "amadeus",
      "provider_place_id": "PAR",
      "name": "PARIS",
      "country": "FR",
      "lat": 48.85334,
      "lon": 2.34889,
      "image_url": "https://images.pexels.com/...",
      "image_source": "pexels"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": {
    "code": "missing_query",
    "message": "Search query is required. Please enter a city or destination name."
  }
}
```

**Error Response (503):**
```json
{
  "error": {
    "code": "service_unavailable",
    "message": "Destination search is temporarily unavailable. Please try again later."
  }
}
```

### `GET /api/v1/landing/home/?q=<query>&banner_q=<banner_query>`
Combined endpoint for banner + destinations (used by frontend).

**Parameters:**
- `banner_q` (optional): Banner search query
- `q` (optional): Destinations search query

**Response:**
```json
{
  "banner": { ... },
  "banner_cached": true,
  "destinations": [ ... ],
  "destinations_cached": false
}
```

## Architecture

```
landing/
├── api/
│   ├── base.py         # LandingAPIView with error handling
│   └── errors.py       # Unified error response format
├── providers/
│   ├── amadeus.py      # Amadeus OAuth + city search
│   └── pexels.py       # Pexels image search
├── services/
│   ├── cache.py        # Versioned cache utilities
│   └── http.py         # HTTP client with timeout/retry
├── views.py            # DRF API views
└── urls.py             # URL routing
```

## Configuration

Required environment variables (see `backend/env.example`):

```bash
# Amadeus API (free test credentials from https://developers.amadeus.com/)
AMADEUS_CLIENT_ID=your_client_id_here
AMADEUS_CLIENT_SECRET=your_client_secret_here
AMADEUS_API_BASE=https://test.api.amadeus.com/v1

# Pexels API (free from https://www.pexels.com/api/)
PEXELS_API_KEY=your_api_key_here

# Performance settings
DRF_THROTTLE_ANON=60/min
DRF_THROTTLE_USER=120/min
CACHE_DEFAULT_TTL_SECONDS=3600
OUTBOUND_HTTP_TIMEOUT_SECONDS=6.0
```

## Cache Strategy

- **Version**: `v2` - increment to invalidate all cached data after provider changes
- **TTL**: 1 hour default (configurable via `CACHE_DEFAULT_TTL_SECONDS`)
- **Backend**: Local memory (switch to Redis for production via Django-Redis)
- **Key format**: `landing:v2:{namespace}:{hash}`

## Error Handling

1. **Upstream API Failures**: Wrapped in `UpstreamError` and mapped to 502 Bad Gateway
2. **Validation Errors**: Return 400 with user-friendly messages
3. **Service Unavailable**: Return 503 when provider credentials missing
4. **Rate Limiting**: DRF throttling returns 429 Too Many Requests
5. **Image Failures**: Non-fatal - destinations return without `image_url`

## Testing

### Manual API Tests
```bash
# Health check
curl http://127.0.0.1:8000/api/v1/landing/health/

# Banner
curl "http://127.0.0.1:8000/api/v1/landing/banner/?q=mountains"

# Destinations
curl "http://127.0.0.1:8000/api/v1/landing/destinations/?q=paris&limit=5"

# Combined home
curl "http://127.0.0.1:8000/api/v1/landing/home/?q=london&banner_q=travel"
```

### Django System Checks
```bash
python manage.py check
```

## Production Considerations

- [ ] Switch to Redis cache backend
- [ ] Enable HTTPS and set `SECURE_*` settings
- [ ] Use production Amadeus API (requires approval)
- [ ] Add monitoring for provider uptime
- [ ] Implement exponential backoff for retries
- [ ] Add request/response logging
- [ ] Set up Sentry or similar error tracking

## Notes

- **No Dummy Data**: All responses use real API data or gracefully fail
- **Test Environment**: Amadeus test API has limited coverage (some cities return 0 results)
- **Image Fallback**: Frontend shows city name when Pexels returns no images
- **Cache Versioning**: Increment `version='v2'` in `cache.py` to invalidate all caches
