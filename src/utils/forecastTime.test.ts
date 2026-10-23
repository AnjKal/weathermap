import { describe, expect, it } from 'vitest'
import { closestForecastIndex, estimateArrivalTime } from './forecastTime'

describe('forecast time selection', () => {
  it('estimates arrival proportionally', () => {
    const start = new Date('2026-01-01T00:00:00Z')
    const arrival = estimateArrivalTime(start, 3600, 100, 50)
    expect(arrival.toISOString()).toBe('2026-01-01T00:30:00.000Z')
  })

  it('returns nearest forecast index', () => {
    const index = closestForecastIndex(
      ['2026-01-01T00:00:00Z', '2026-01-01T01:00:00Z', '2026-01-01T02:00:00Z'],
      new Date('2026-01-01T01:20:00Z'),
    )
    expect(index).toBe(1)
  })
})
