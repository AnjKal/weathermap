import { describe, expect, it } from 'vitest'
import { sampleRoutePoints } from './routeSampling'

describe('route sampling', () => {
  it('includes start and destination', () => {
    const points = sampleRoutePoints(
      [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ],
      20,
      20,
    )

    expect(points[0].distanceFromStartKm).toBe(0)
    expect(points.at(-1)?.distanceFromStartKm).toBeGreaterThan(100)
  })
})
