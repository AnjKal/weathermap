import type { LocationSuggestion } from '../types/location'

const geocodingBaseUrl = import.meta.env.VITE_GEOCODING_API_BASE_URL ?? 'https://nominatim.openstreetmap.org'

const geocodeCache = new Map<string, LocationSuggestion[]>()

type NominatimResult = {
  place_id: number
  lat: string
  lon: string
  display_name: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

export const searchLocations = async (query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> => {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2) return []

  const cached = geocodeCache.get(normalized)
  if (cached) return cached

  const url = new URL('/search', geocodingBaseUrl)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '5')

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Unable to fetch location suggestions')
  }

  const payload = (await response.json()) as NominatimResult[]
  const mapped = payload.map((item) => ({
    id: String(item.place_id),
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    displayName: item.display_name,
    subtitle: [item.address?.city ?? item.address?.town ?? item.address?.village, item.address?.state, item.address?.country]
      .filter(Boolean)
      .join(', '),
  }))

  geocodeCache.set(normalized, mapped)
  return mapped
}
