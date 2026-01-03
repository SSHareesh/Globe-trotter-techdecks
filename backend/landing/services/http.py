from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class HttpResponse:
    status: int
    data: Any
    headers: dict[str, str]


class UpstreamError(RuntimeError):
    def __init__(self, message: str, *, status: int | None = None, details: Any | None = None):
        super().__init__(message)
        self.status = status
        self.details = details


def get_json(url: str, *, headers: dict[str, str] | None = None, timeout_seconds: float = 6.0) -> HttpResponse:
    default_headers = {
        'Accept': 'application/json',
        'User-Agent': 'GlobeTrotterTechDecks/1.0',
    }
    merged_headers = {**default_headers, **(headers or {})}
    req = Request(url, headers=merged_headers)

    try:
        with urlopen(req, timeout=timeout_seconds) as resp:
            body = resp.read().decode('utf-8')
            content_type = resp.headers.get('Content-Type', '')
            parsed: Any
            if 'application/json' in content_type:
                parsed = json.loads(body) if body else None
            else:
                parsed = json.loads(body) if body else None
            return HttpResponse(
                status=resp.status,
                data=parsed,
                headers={k: v for k, v in resp.headers.items()},
            )

    except HTTPError as e:
        raw = e.read().decode('utf-8') if hasattr(e, 'read') else ''
        try:
            parsed = json.loads(raw) if raw else None
        except Exception:
            parsed = raw
        raise UpstreamError('Upstream HTTP error', status=e.code, details=parsed) from e

    except URLError as e:
        raise UpstreamError('Upstream network error', details=str(e)) from e
        
    except (TimeoutError, Exception) as e:
        # Catch unexpected timeouts or other crashes to prevent 500s
        raise UpstreamError(f'Upstream connection failed: {type(e).__name__}', details=str(e)) from e


def post_form(
    url: str,
    *,
    form: dict[str, str],
    headers: dict[str, str] | None = None,
    timeout_seconds: float = 6.0,
) -> HttpResponse:
    default_headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'GlobeTrotterTechDecks/1.0',
    }
    merged_headers = {**default_headers, **(headers or {})}
    data = urlencode(form).encode('utf-8')
    req = Request(url, data=data, headers=merged_headers, method='POST')

    try:
        with urlopen(req, timeout=timeout_seconds) as resp:
            body = resp.read().decode('utf-8')
            content_type = resp.headers.get('Content-Type', '')
            parsed: Any
            if 'application/json' in content_type:
                parsed = json.loads(body) if body else None
            else:
                parsed = json.loads(body) if body else None
            return HttpResponse(
                status=resp.status,
                data=parsed,
                headers={k: v for k, v in resp.headers.items()},
            )

    except HTTPError as e:
        raw = e.read().decode('utf-8') if hasattr(e, 'read') else ''
        try:
            parsed = json.loads(raw) if raw else None
        except Exception:
            parsed = raw
        raise UpstreamError('Upstream HTTP error', status=e.code, details=parsed) from e

    except URLError as e:
        raise UpstreamError('Upstream network error', details=str(e)) from e
        
    except (TimeoutError, Exception) as e:
        raise UpstreamError(f'Upstream connection failed: {type(e).__name__}', details=str(e)) from e
