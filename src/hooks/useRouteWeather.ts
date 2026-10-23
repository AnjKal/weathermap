import { useEffect, useMemo, useState } from 'react'
import { ROUTE_SAMPLE_INTERVAL_KM, ROUTE_SAMPLE_MAX_POINTS } from '../config/mapConfig'
import { fetchRouteWeather, weatherPointKey } from '../services/weatherService'
import type { Coordinates } from '../types/location'
import type { RouteResponse, RouteSamplePoint } from '../types/route'
import type { RouteWeatherPoint } from '../types/weather'
import { estimateArrivalTime } from '../utils/forecastTime'
import { sampleRoutePoints } from '../utils/routeSampling'

const toCoordinates = (geometry: Array<[number, number]>): Coordinates[] =>
  geometry.map(([longitude, latitude]) => ({ latitude, longitude }))

export const useRouteWeather = (route: RouteResponse | null): {
  weatherPoints: RouteWeatherPoint[]
  selectedId?: string
  setSelectedId: (id: string | undefined) => void
} => {
  const [weatherPoints, setWeatherPoints] = useState<RouteWeatherPoint[]>([])
  const [selectedId, setSelectedId] = useState<string>()

  const sampledPoints = useMemo<RouteSamplePoint[]>(() => {
    if (!route) return []
    return sampleRoutePoints(toCoordinates(route.geometry), ROUTE_SAMPLE_INTERVAL_KM, ROUTE_SAMPLE_MAX_POINTS)
  }, [route])

  useEffect(() => {
    if (!route) {
      setWeatherPoints([])
      setSelectedId(undefined)
      return
    }

    const controller = new AbortController()
    const pointsWithLoading = sampledPoints.map((point) => ({ ...point, loading: true }))
    setWeatherPoints(pointsWithLoading)

    const now = new Date()
    fetchRouteWeather(
      sampledPoints.map((point) => ({
        point,
        arrivalTime: estimateArrivalTime(now, route.durationSeconds, route.distanceMeters / 1000, point.distanceFromStartKm),
      })),
      controller.signal,
    )
      .then((responses) => {
        if (controller.signal.aborted) return
        setWeatherPoints((current) =>
          current.map((point) => {
            const key = weatherPointKey(point)
            const weather = responses.find((item) => item.key === key)?.weather
            return {
              ...point,
              weather,
              loading: false,
              error: weather ? undefined : 'Weather unavailable',
            }
          }),
        )
      })
      .catch((fetchError: Error) => {
        if (controller.signal.aborted) return
        setWeatherPoints((current) =>
          current.map((point) => ({
            ...point,
            loading: false,
            error: fetchError.message,
          })),
        )
      })

    if (sampledPoints.length > 0) setSelectedId(sampledPoints[0].id)

    return () => controller.abort()
  }, [route, sampledPoints])

  return { weatherPoints, selectedId, setSelectedId }
}
