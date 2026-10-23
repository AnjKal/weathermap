import type { UnitSystem } from '../types/weather'

export const formatTemperature = (valueCelsius: number | null, units: UnitSystem): string => {
  if (valueCelsius === null) return 'Unavailable'
  if (units === 'metric') return `${valueCelsius.toFixed(1)} °C`
  return `${((valueCelsius * 9) / 5 + 32).toFixed(1)} °F`
}

export const formatWindSpeed = (kph: number | null, units: UnitSystem): string => {
  if (kph === null) return 'Unavailable'
  if (units === 'metric') return `${kph.toFixed(1)} km/h`
  return `${(kph * 0.621371).toFixed(1)} mph`
}

export const formatDistance = (kilometers: number): string => `${kilometers.toFixed(1)} km`

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours === 0) return `${minutes} min`
  return `${hours} h ${minutes} min`
}
