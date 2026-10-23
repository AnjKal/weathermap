import { describe, expect, it } from 'vitest'
import { formatTemperature, formatWindSpeed } from './units'

describe('unit conversions', () => {
  it('formats celsius and fahrenheit', () => {
    expect(formatTemperature(10, 'metric')).toBe('10.0 °C')
    expect(formatTemperature(10, 'imperial')).toBe('50.0 °F')
  })

  it('formats wind speed', () => {
    expect(formatWindSpeed(100, 'metric')).toBe('100.0 km/h')
    expect(formatWindSpeed(100, 'imperial')).toBe('62.1 mph')
  })
})
