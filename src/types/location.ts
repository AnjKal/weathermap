export type Coordinates = {
  latitude: number
  longitude: number
}

export type LocationSuggestion = Coordinates & {
  id: string
  displayName: string
  subtitle: string
}

export type SelectedLocation = Coordinates & {
  displayName: string
}
