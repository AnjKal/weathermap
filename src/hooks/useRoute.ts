import { useState } from 'react'
import { requestRoute } from '../services/routeService'
import type { SelectedLocation } from '../types/location'
import type { RouteResponse } from '../types/route'

export const useRoute = (): {
  route: RouteResponse | null
  loading: boolean
  error?: string
  findRoute: (start: SelectedLocation, end: SelectedLocation) => Promise<RouteResponse | null>
  clearRoute: () => void
} => {
  const [route, setRoute] = useState<RouteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const findRoute = async (start: SelectedLocation, end: SelectedLocation): Promise<RouteResponse | null> => {
    setLoading(true)
    setError(undefined)
    try {
      const nextRoute = await requestRoute(start, end)
      setRoute(nextRoute)
      return nextRoute
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to calculate route')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    route,
    loading,
    error,
    findRoute,
    clearRoute: () => setRoute(null),
  }
}
