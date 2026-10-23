import L from 'leaflet'
import { Maximize2, X } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '../config/mapConfig'
import type { SelectedLocation } from '../types/location'
import type { RouteResponse } from '../types/route'
import type { RouteWeatherPoint } from '../types/weather'
import { haversineDistanceKm } from '../utils/distance'
import { nearestPointOnRoute } from '../utils/geometry'
import { interpretWeatherCode } from '../utils/weatherCodes'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type RouteMapProps = {
  start?: SelectedLocation
  end?: SelectedLocation
  route?: RouteResponse | null
  weatherPoints: RouteWeatherPoint[]
  selectedWeatherId?: string
  onSelectWeatherPoint: (id: string) => void
  onHoverRoute: (id: string) => void
  onClearRoute: () => void
  onOpenMobileWeather: () => void
}

const FitToRoute = ({ route }: { route?: RouteResponse | null }): null => {
  const map = useMap()
  if (route?.geometry.length) {
    const bounds = L.latLngBounds(route.geometry.map(([lng, lat]) => [lat, lng] as [number, number]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }
  return null
}

export const RouteMap = ({
  start,
  end,
  route,
  weatherPoints,
  selectedWeatherId,
  onSelectWeatherPoint,
  onHoverRoute,
  onClearRoute,
  onOpenMobileWeather,
}: RouteMapProps) => {
  const mapRef = useRef<L.Map | null>(null)

  const routeLatLngs = useMemo(() => route?.geometry.map(([lng, lat]) => [lat, lng] as [number, number]) ?? [], [route])

  const selectedPoint = weatherPoints.find((point) => point.id === selectedWeatherId)

  return (
    <div className='relative h-[460px] flex-1 overflow-hidden rounded-xl border border-slate-200 md:h-[calc(100vh-170px)]'>
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        className='h-full w-full'
        ref={(map) => {
          mapRef.current = map
        }}
      >
        <TileLayer
          url={import.meta.env.VITE_TILE_LAYER_URL ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitToRoute route={route} />

        {start ? <Marker position={[start.latitude, start.longitude]} /> : null}
        {end ? <Marker position={[end.latitude, end.longitude]} /> : null}

        {routeLatLngs.length > 1 ? (
          <Polyline
            positions={routeLatLngs}
            pathOptions={{ color: '#0369a1', weight: 5 }}
            eventHandlers={{
              mousemove: (event) => {
                if (!routeLatLngs.length || !weatherPoints.length) return
                const near = nearestPointOnRoute(
                  { latitude: event.latlng.lat, longitude: event.latlng.lng },
                  routeLatLngs.map(([latitude, longitude]) => ({ latitude, longitude })),
                )
                if (!near) return

                const nearestWeather = weatherPoints.reduce((best, current) => {
                  const distance = haversineDistanceKm(near, current)
                  return distance < best.distance ? { id: current.id, distance } : best
                }, { id: weatherPoints[0].id, distance: Number.POSITIVE_INFINITY })

                if (nearestWeather.distance < 10) {
                  onHoverRoute(nearestWeather.id)
                }
              },
            }}
          />
        ) : null}

        {weatherPoints.map((point) => {
          const selected = point.id === selectedWeatherId
          const condition = interpretWeatherCode(point.weather?.weatherCode ?? null)
          return (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              eventHandlers={{
                click: () => {
                  onSelectWeatherPoint(point.id)
                  onOpenMobileWeather()
                },
                mouseover: () => onHoverRoute(point.id),
              }}
              icon={L.divIcon({
                className: 'weather-marker',
                html: `<div style="background:${selected ? '#f97316' : '#0ea5e9'};color:white;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2px solid white;">${condition.emoji}</div>`,
              })}
            >
              {point.weather ? <Tooltip>{`${condition.label} • ${point.weather.temperatureC ?? 'N/A'}°C`}</Tooltip> : null}
            </Marker>
          )
        })}
      </MapContainer>

      <div className='pointer-events-none absolute right-2 top-2 flex gap-2'>
        <button
          type='button'
          className='pointer-events-auto rounded-md bg-white/95 p-2 shadow'
          onClick={() => {
            const map = mapRef.current
            if (!map || !routeLatLngs.length) return
            map.fitBounds(L.latLngBounds(routeLatLngs), { padding: [40, 40] })
          }}
          aria-label='Recenter route'
        >
          <Maximize2 className='h-4 w-4' />
        </button>
        <button
          type='button'
          className='pointer-events-auto rounded-md bg-white/95 p-2 shadow'
          onClick={onClearRoute}
          aria-label='Clear route'
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      {selectedPoint ? (
        <div className='absolute bottom-2 left-2 rounded-md bg-white/90 px-3 py-1 text-xs text-slate-700 md:hidden'>
          Selected: {selectedPoint.distanceFromStartKm.toFixed(1)} km
        </div>
      ) : null}
    </div>
  )
}
