import type { Coordinates } from '../types/location'

type XY = { x: number; y: number }

const toXY = (point: Coordinates): XY => ({ x: point.longitude, y: point.latitude })
const fromXY = (point: XY): Coordinates => ({ longitude: point.x, latitude: point.y })

export const nearestPointOnSegment = (point: Coordinates, start: Coordinates, end: Coordinates): Coordinates => {
  const p = toXY(point)
  const a = toXY(start)
  const b = toXY(end)
  const ab = { x: b.x - a.x, y: b.y - a.y }
  const denom = ab.x * ab.x + ab.y * ab.y
  if (denom === 0) return start

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / denom))
  return fromXY({ x: a.x + ab.x * t, y: a.y + ab.y * t })
}

export const nearestPointOnRoute = (point: Coordinates, route: Coordinates[]): Coordinates | null => {
  if (route.length < 2) return route[0] ?? null

  let best: Coordinates | null = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (let index = 1; index < route.length; index += 1) {
    const candidate = nearestPointOnSegment(point, route[index - 1], route[index])
    const distance = (candidate.latitude - point.latitude) ** 2 + (candidate.longitude - point.longitude) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      best = candidate
    }
  }

  return best
}
