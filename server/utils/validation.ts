export const isValidLatitude = (value: number): boolean => Number.isFinite(value) && value >= -90 && value <= 90

export const isValidLongitude = (value: number): boolean =>
  Number.isFinite(value) && value >= -180 && value <= 180
