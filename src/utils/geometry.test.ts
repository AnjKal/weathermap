import { describe, expect, it } from 'vitest'
import { nearestPointOnSegment } from './geometry'

describe('nearest point geometry', () => {
  it('projects onto a segment', () => {
    const nearest = nearestPointOnSegment(
      { latitude: 1, longitude: 1 },
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 2 },
    )
    expect(nearest.latitude).toBeCloseTo(0, 5)
    expect(nearest.longitude).toBeCloseTo(1, 5)
  })
})
