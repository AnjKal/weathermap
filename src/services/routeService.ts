import type { SelectedLocation } from '../types/location'
import type { RouteResponse } from '../types/route'

export const requestRoute = async (start: SelectedLocation, end: SelectedLocation): Promise<RouteResponse> => {
  const response = await fetch('/api/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: { latitude: start.latitude, longitude: start.longitude },
      end: { latitude: end.latitude, longitude: end.longitude },
    }),
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: 'Route request failed' }))) as { message?: string }
    throw new Error(error.message ?? 'Route request failed')
  }

  return (await response.json()) as RouteResponse
}
