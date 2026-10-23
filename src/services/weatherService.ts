import { WEATHER_CACHE_TTL_MS } from '../config/mapConfig'
import type { Coordinates } from '../types/location'
import type { HourlyWeather, WeatherSnapshot } from '../types/weather'
import { TTLCache } from '../utils/cache'
import { closestForecastIndex } from '../utils/forecastTime'

const weatherBaseUrl = import.meta.env.VITE_WEATHER_API_BASE_URL ?? 'https://api.open-meteo.com/v1'
const weatherCache = new TTLCache<WeatherSnapshot>(WEATHER_CACHE_TTL_MS)
const inFlight = new Map<string, Promise<WeatherSnapshot>>()

type OpenMeteoResponse = {
  hourly?: {
    time?: string[]
    temperature_2m?: Array<number | null>
    apparent_temperature?: Array<number | null>
    relative_humidity_2m?: Array<number | null>
    precipitation?: Array<number | null>
    precipitation_probability?: Array<number | null>
    weather_code?: Array<number | null>
    wind_speed_10m?: Array<number | null>
    wind_direction_10m?: Array<number | null>
    cloud_cover?: Array<number | null>
  }
}

const weatherParams = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'cloud_cover',
].join(',')

const cacheKey = (point: Coordinates): string => `${point.latitude.toFixed(4)},${point.longitude.toFixed(4)}`

export const normalizeWeather = (payload: OpenMeteoResponse, targetTime: Date): WeatherSnapshot => {
  const hourly = payload.hourly
  const times = hourly?.time ?? []
  const selectedIdx = closestForecastIndex(times, targetTime)
  const get = <T>(values: T[] | undefined): T | null => (selectedIdx >= 0 ? (values?.[selectedIdx] ?? null) : null)

  const hourlyPreview: HourlyWeather[] = times.slice(0, 8).map((time, index) => ({
    time,
    temperatureC: hourly?.temperature_2m?.[index] ?? null,
    weatherCode: hourly?.weather_code?.[index] ?? null,
    precipitationProbability: hourly?.precipitation_probability?.[index] ?? null,
  }))

  return {
    validTime: selectedIdx >= 0 ? times[selectedIdx] : null,
    temperatureC: get(hourly?.temperature_2m),
    apparentTemperatureC: get(hourly?.apparent_temperature),
    relativeHumidity: get(hourly?.relative_humidity_2m),
    precipitationMm: get(hourly?.precipitation),
    precipitationProbability: get(hourly?.precipitation_probability),
    weatherCode: get(hourly?.weather_code),
    windSpeedKph: get(hourly?.wind_speed_10m),
    windDirection: get(hourly?.wind_direction_10m),
    cloudCover: get(hourly?.cloud_cover),
    hourly: hourlyPreview,
  }
}

const fetchWeatherSingle = async (point: Coordinates, arrivalTime: Date, signal?: AbortSignal): Promise<WeatherSnapshot> => {
  const key = cacheKey(point)
  const cached = weatherCache.get(key)
  if (cached) return cached

  const pending = inFlight.get(key)
  if (pending) return pending

  const url = new URL('/forecast', weatherBaseUrl)
  url.searchParams.set('latitude', String(point.latitude))
  url.searchParams.set('longitude', String(point.longitude))
  url.searchParams.set('hourly', weatherParams)
  url.searchParams.set('timezone', 'auto')

  const request = fetch(url, { signal })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Weather API failed (${response.status})`)
      const payload = (await response.json()) as OpenMeteoResponse
      const normalized = normalizeWeather(payload, arrivalTime)
      weatherCache.set(key, normalized)
      return normalized
    })
    .finally(() => {
      inFlight.delete(key)
    })

  inFlight.set(key, request)
  return request
}

const runBatched = async <T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<T[]> => {
  const results: T[] = []
  let index = 0

  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (index < tasks.length) {
      const taskIndex = index
      index += 1
      results[taskIndex] = await tasks[taskIndex]()
    }
  })

  await Promise.all(workers)
  return results
}

export const fetchRouteWeather = async (
  points: Array<{ point: Coordinates; arrivalTime: Date }>,
  signal?: AbortSignal,
): Promise<Array<{ key: string; weather: WeatherSnapshot }>> => {
  const tasks = points.map(({ point, arrivalTime }) => async () => ({
    key: cacheKey(point),
    weather: await fetchWeatherSingle(point, arrivalTime, signal),
  }))

  return runBatched(tasks, 3)
}

export const weatherPointKey = cacheKey
