const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:8000';

interface Params {
  [key: string]: string | number | undefined;
}

function buildUrl(path: string, params?: Params): string {
  const url = new URL(path, BACKEND_ORIGIN);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function handleResponse(res: Response) {
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
    const error: any = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function fetchLandingBanner(q?: string) {
  const res = await fetch(buildUrl('/api/v1/landing/banner/', { q }));
  return handleResponse(res);
}

export async function fetchDestinations(q: string, limit: number = 6) {
  if (!q || !q.trim()) {
    throw new Error('Please enter a search term');
  }
  const res = await fetch(buildUrl('/api/v1/landing/destinations/', { q, limit }));
  const data = await handleResponse(res);
  // Map backend response to frontend format
  return {
    ...data,
    destinations: (data.results || []).map((dest: any) => ({
      ...dest,
      city_name: dest.name,
      country_name: dest.country,
      iata_code: dest.provider_place_id,
    })),
  };
}

export async function fetchTrendingDestinations(limit: number = 8) {
  const res = await fetch(buildUrl('/api/v1/landing/trending/', { limit }));
  const data = await handleResponse(res);
  // Map backend response to frontend format
  return {
    ...data,
    destinations: (data.results || []).map((dest: any) => ({
      ...dest,
      city_name: dest.name,
      country_name: dest.country,
      iata_code: dest.provider_place_id,
    })),
  };
}

export async function fetchAttractions(city: string, limit: number = 18) {
  if (!city || !city.trim()) {
    throw new Error('City is required');
  }
  const res = await fetch(buildUrl('/api/v1/landing/attractions/', { city, limit }));
  const data = await handleResponse(res);
  return {
    ...data,
    attractions: (data.results || []).map((p: any) => ({
      name: p.name,
      description: p.description,
      image_url: p.image_url,
      source_url: p.source_url,
      source: p.source,
    })),
  };
}

export async function fetchFlights(params: { origin: string, destination: string, departure_date: string, return_date?: string }) {
  const res = await fetch(buildUrl('/api/v1/landing/trip/flights/', params as any));
  return handleResponse(res);
}

export async function fetchHotels(params: { city: string, check_in: string, check_out: string }) {
  const res = await fetch(buildUrl('/api/v1/landing/trip/hotels/', params as any));
  return handleResponse(res);
}
