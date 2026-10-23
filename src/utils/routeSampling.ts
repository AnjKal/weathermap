import type { Coordinates } from '../types/location'
import type { RouteSamplePoint } from '../types/route'
import { cumulativeDistancesKm } from './distance'

const interpolate = (start: Coordinates, end: Coordinates, ratio: number): Coordinates => ({
  latitude: start.latitude + (end.latitude - start.latitude) * ratio,
  longitude: start.longitude + (end.longitude - start.longitude) * ratio,
})

export const sampleRoutePoints = (
  geometry: Coordinates[],
  intervalKm: number,
  maxPoints: number,
): RouteSamplePoint[] => {
  if (!geometry.length) return []

  const cumulative = cumulativeDistancesKm(geometry)
  const total = cumulative.at(-1) ?? 0
  if (total === 0) {
    return [
      {
        id: 'point-0',
        latitude: geometry[0].latitude,
        longitude: geometry[0].longitude,
        distanceFromStartKm: 0,
      },
    ]
  }

  const checkpoints = new Set<number>([0, total])
  for (let target = intervalKm; target < total; target += intervalKm) {
    checkpoints.add(target)
  }

  const sortedTargets = Array.from(checkpoints).sort((a, b) => a - b)
  const limitedTargets = sortedTargets.length > maxPoints ? sortedTargets.filter((_, idx) => idx % Math.ceil(sortedTargets.length / maxPoints) === 0) : sortedTargets

  return limitedTargets.map((target, index) => {
    let segmentIndex = 1
    while (segmentIndex < cumulative.length && cumulative[segmentIndex] < target) {
      segmentIndex += 1
    }

    if (segmentIndex >= geometry.length) {
      const last = geometry.at(-1)!
      return {
        id: `point-${index}`,
        latitude: last.latitude,
        longitude: last.longitude,
        distanceFromStartKm: total,
      }
    }

    const prevDistance = cumulative[segmentIndex - 1]
    const nextDistance = cumulative[segmentIndex]
    const ratio = nextDistance === prevDistance ? 0 : (target - prevDistance) / (nextDistance - prevDistance)
    const interpolated = interpolate(geometry[segmentIndex - 1], geometry[segmentIndex], ratio)

    return {
      id: `point-${index}`,
      latitude: interpolated.latitude,
      longitude: interpolated.longitude,
      distanceFromStartKm: target,
    }
  })
}
