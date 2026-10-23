import type { Coordinates } from './location'

export type RouteInstruction = {
  instruction: string
  distance: number
  duration: number
}

export type RouteResponse = {
  geometry: Array<[number, number]>
  distanceMeters: number
  durationSeconds: number
  instructions: RouteInstruction[]
}

export type RouteSamplePoint = Coordinates & {
  id: string
  distanceFromStartKm: number
}
