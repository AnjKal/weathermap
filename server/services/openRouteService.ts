import { getServerEnv } from '../config/env.js'

export type Coordinate = { latitude: number; longitude: number }

type OrsGeoJsonResponse = {
  features?: Array<{
    geometry?: { coordinates?: [number, number][] }
    properties?: {
      summary?: { distance?: number; duration?: number }
      segments?: Array<{ steps?: Array<{ instruction?: string; distance?: number; duration?: number }> }>
    }
  }>
}

export type NormalizedRouteResponse = {
  geometry: Array<[number, number]>
  distanceMeters: number
  durationSeconds: number
  instructions: Array<{ instruction: string; distance: number; duration: number }>
}

export const fetchRouteFromORS = async (start: Coordinate, end: Coordinate): Promise<NormalizedRouteResponse> => {
  const env = getServerEnv()
  const response = await fetch(`${env.ORS_API_BASE_URL}/v2/directions/driving-car/geojson`, {
    method: 'POST',
    headers: {
      Authorization: env.ORS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
      instructions: true,
      preference: 'recommended',
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    const status = response.status
    if (status === 401 || status === 403) throw new Error('Routing authentication failed. Check ORS API key.')
    if (status === 429) throw new Error('Routing quota or rate limit exceeded. Try again later.')
    throw new Error(`Routing request failed (${status}): ${detail.slice(0, 200)}`)
  }

  const payload = (await response.json()) as OrsGeoJsonResponse
  const route = payload.features?.[0]
  const coordinates = route?.geometry?.coordinates
  const distanceMeters = route?.properties?.summary?.distance
  const durationSeconds = route?.properties?.summary?.duration

  if (
    !coordinates?.length ||
    typeof distanceMeters !== 'number' ||
    Number.isNaN(distanceMeters) ||
    typeof durationSeconds !== 'number' ||
    Number.isNaN(durationSeconds)
  ) {
    throw new Error('Malformed routing response from upstream provider.')
  }

  const instructions =
    route?.properties?.segments
      ?.flatMap((segment) => segment.steps ?? [])
      .map((step) => ({
        instruction: step.instruction ?? 'Continue',
        distance: step.distance ?? 0,
        duration: step.duration ?? 0,
      })) ?? []

  const normalizedDistance = distanceMeters
  const normalizedDuration = durationSeconds

  return {
    geometry: coordinates,
    distanceMeters: normalizedDistance,
    durationSeconds: normalizedDuration,
    instructions,
  }
}
