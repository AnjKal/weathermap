import { describe, expect, it } from 'vitest'
import { normalizeWeather } from './weatherService'

describe('weather normalization', () => {
  it('handles missing fields without forcing zero values', () => {
    const weather = normalizeWeather({ hourly: { time: ['2026-01-01T00:00:00Z'] } }, new Date('2026-01-01T00:00:00Z'))
    expect(weather.temperatureC).toBeNull()
    expect(weather.precipitationMm).toBeNull()
  })
})
