import type { Coordinates } from '../types/location'

const EARTH_RADIUS_KM = 6371
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

export const haversineDistanceKm = (a: Coordinates, b: Coordinates): number => {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLon = toRadians(b.longitude - a.longitude)
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)

  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export const cumulativeDistancesKm = (points: Coordinates[]): number[] => {
  const distances = [0]
  for (let index = 1; index < points.length; index += 1) {
    const segment = haversineDistanceKm(points[index - 1], points[index])
    distances.push(distances[index - 1] + segment)
  }
  return distances
}
