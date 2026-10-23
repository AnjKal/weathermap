export const weatherCodeMap: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Fog', emoji: '🌫️' },
  48: { label: 'Depositing rime fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Moderate drizzle', emoji: '🌦️' },
  55: { label: 'Dense drizzle', emoji: '🌧️' },
  61: { label: 'Slight rain', emoji: '🌧️' },
  63: { label: 'Moderate rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  71: { label: 'Slight snow', emoji: '🌨️' },
  73: { label: 'Moderate snow', emoji: '🌨️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  80: { label: 'Rain showers', emoji: '🌧️' },
  81: { label: 'Moderate rain showers', emoji: '🌧️' },
  82: { label: 'Violent rain showers', emoji: '⛈️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
}

export const interpretWeatherCode = (code: number | null): { label: string; emoji: string } => {
  if (code === null) return { label: 'Unavailable', emoji: '❔' }
  return weatherCodeMap[code] ?? { label: 'Unknown conditions', emoji: '❔' }
}
