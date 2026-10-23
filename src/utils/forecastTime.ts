export const estimateArrivalTime = (
  routeStart: Date,
  routeDurationSeconds: number,
  totalDistanceKm: number,
  distanceFromStartKm: number,
): Date => {
  if (totalDistanceKm <= 0) return routeStart
  const ratio = Math.min(1, Math.max(0, distanceFromStartKm / totalDistanceKm))
  return new Date(routeStart.getTime() + ratio * routeDurationSeconds * 1000)
}

export const closestForecastIndex = (hourlyTimes: string[], targetTime: Date): number => {
  if (!hourlyTimes.length) return -1
  const target = targetTime.getTime()
  let bestIdx = 0
  let bestDelta = Number.POSITIVE_INFINITY

  hourlyTimes.forEach((time, index) => {
    const delta = Math.abs(new Date(time).getTime() - target)
    if (delta < bestDelta) {
      bestDelta = delta
      bestIdx = index
    }
  })

  return bestIdx
}
