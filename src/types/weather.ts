import type { Coordinates } from './location'

export type UnitSystem = 'metric' | 'imperial'

export type HourlyWeather = {
  time: string
  temperatureC: number | null
  weatherCode: number | null
  precipitationProbability: number | null
}

export type WeatherSnapshot = {
  validTime: string | null
  temperatureC: number | null
  apparentTemperatureC: number | null
  relativeHumidity: number | null
  precipitationMm: number | null
  precipitationProbability: number | null
  weatherCode: number | null
  windSpeedKph: number | null
  windDirection: number | null
  cloudCover: number | null
  hourly: HourlyWeather[]
}

export type RouteWeatherPoint = Coordinates & {
  id: string
  distanceFromStartKm: number
  weather?: WeatherSnapshot
  loading: boolean
  error?: string
}
