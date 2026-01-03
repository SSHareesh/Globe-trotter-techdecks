const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:8000';

function buildUrl(path, params) {
  const url = new URL(path, BACKEND_ORIGIN);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function handleResponse(res) {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If JSON parsing fails, use generic message
    }
    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function fetchLandingBanner(q) {
  const res = await fetch(buildUrl('/api/v1/landing/banner/', { q }));
  return handleResponse(res);
}

export async function fetchDestinations(q, limit = 6) {
  if (!q || !q.trim()) {
    throw new Error('Please enter a search term');
  }
  const res = await fetch(buildUrl('/api/v1/landing/destinations/', { q, limit }));
  const data = await handleResponse(res);
  // Map backend response to frontend format
  return {
    ...data,
    destinations: (data.results || []).map(dest => ({
      ...dest,
      city_name: dest.name,
      country_name: dest.country,
      iata_code: dest.provider_place_id,
    })),
  };
}

export async function fetchTrendingDestinations(limit = 8) {
  const res = await fetch(buildUrl('/api/v1/landing/trending/', { limit }));
  const data = await handleResponse(res);
  // Map backend response to frontend format
  return {
    ...data,
    destinations: (data.results || []).map(dest => ({
      ...dest,
      city_name: dest.name,
      country_name: dest.country,
      iata_code: dest.provider_place_id,
    })),
  };
}
