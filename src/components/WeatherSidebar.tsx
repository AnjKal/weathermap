import { Cloud, Droplets, Gauge, LocateFixed, Thermometer, Wind } from 'lucide-react'
import type { RouteWeatherPoint, UnitSystem } from '../types/weather'
import { formatTemperature, formatWindSpeed } from '../utils/units'
import { interpretWeatherCode } from '../utils/weatherCodes'

type WeatherSidebarProps = {
  point?: RouteWeatherPoint
  units: UnitSystem
  hasRoute: boolean
  openOnMobile: boolean
  onCloseMobile: () => void
}

const Value = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className='flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2'>
    <span className='flex items-center gap-2 text-slate-700'>
      {icon}
      {label}
    </span>
    <span className='font-medium text-slate-900'>{value}</span>
  </div>
)

export const WeatherSidebar = ({ point, units, hasRoute, openOnMobile, onCloseMobile }: WeatherSidebarProps) => {
  const card = !hasRoute ? (
    <p className='text-sm text-slate-600'>Calculate a route to inspect weather along the journey.</p>
  ) : !point ? (
    <p className='text-sm text-slate-600'>Select a weather marker or route point to view forecast details.</p>
  ) : point.loading ? (
    <p className='text-sm text-slate-600'>Loading weather forecast...</p>
  ) : point.error ? (
    <p className='text-sm text-red-700'>{point.error}</p>
  ) : (
    (() => {
      const weather = point.weather
      const condition = interpretWeatherCode(weather?.weatherCode ?? null)
      return (
        <div className='space-y-3'>
          <div className='rounded-md border border-slate-200 bg-slate-50 p-3'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>Forecast point</p>
            <p className='text-sm font-semibold text-slate-900'>{condition.emoji} {condition.label}</p>
            <p className='text-xs text-slate-600'>
              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)} • {point.distanceFromStartKm.toFixed(1)} km from start
            </p>
            <p className='text-xs text-slate-500'>Forecast valid: {weather?.validTime ?? 'Unavailable'}</p>
          </div>

          <div className='grid gap-2'>
            <Value label='Temperature' value={formatTemperature(weather?.temperatureC ?? null, units)} icon={<Thermometer className='h-4 w-4' />} />
            <Value label='Feels like' value={formatTemperature(weather?.apparentTemperatureC ?? null, units)} icon={<Thermometer className='h-4 w-4' />} />
            <Value label='Humidity' value={weather?.relativeHumidity == null ? 'Unavailable' : `${weather.relativeHumidity}%`} icon={<Gauge className='h-4 w-4' />} />
            <Value label='Precipitation' value={weather?.precipitationMm == null ? 'Unavailable' : `${weather.precipitationMm.toFixed(1)} mm`} icon={<Droplets className='h-4 w-4' />} />
            <Value
              label='Rain probability'
              value={weather?.precipitationProbability == null ? 'Unavailable' : `${weather.precipitationProbability}%`}
              icon={<Cloud className='h-4 w-4' />}
            />
            <Value label='Wind' value={formatWindSpeed(weather?.windSpeedKph ?? null, units)} icon={<Wind className='h-4 w-4' />} />
            <Value
              label='Wind direction'
              value={weather?.windDirection == null ? 'Unavailable' : `${Math.round(weather.windDirection)}°`}
              icon={<LocateFixed className='h-4 w-4' />}
            />
            <Value label='Cloud cover' value={weather?.cloudCover == null ? 'Unavailable' : `${weather.cloudCover}%`} icon={<Cloud className='h-4 w-4' />} />
          </div>

          <div>
            <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>Hourly preview</p>
            <ul className='space-y-1 text-xs text-slate-700'>
              {weather?.hourly.map((hour) => {
                const hourCondition = interpretWeatherCode(hour.weatherCode)
                return (
                  <li key={hour.time} className='flex items-center justify-between rounded border border-slate-200 px-2 py-1'>
                    <span>{hour.time}</span>
                    <span>{hourCondition.emoji} {formatTemperature(hour.temperatureC, units)}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )
    })()
  )

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-[1000] max-h-[65vh] overflow-y-auto rounded-t-xl border border-slate-200 bg-white p-4 shadow-xl transition md:static md:max-h-none md:w-80 md:rounded-xl md:shadow-none ${openOnMobile ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}
    >
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-slate-900'>Weather details</h3>
        <button type='button' className='text-sm text-slate-600 md:hidden' onClick={onCloseMobile}>
          Close
        </button>
      </div>
      {card}
      <p className='mt-4 text-xs text-slate-500'>Forecast data by <a className='underline' href='https://open-meteo.com/' target='_blank' rel='noreferrer'>Open-Meteo</a>.</p>
    </aside>
  )
}
