import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { RouteMap } from './components/RouteMap'
import { RoutePanel } from './components/RoutePanel'
import { WeatherSidebar } from './components/WeatherSidebar'
import { useGeocoding } from './hooks/useGeocoding'
import { useRoute } from './hooks/useRoute'
import { useRouteWeather } from './hooks/useRouteWeather'
import type { LocationSuggestion, SelectedLocation } from './types/location'
import type { UnitSystem } from './types/weather'

const mapSuggestionToSelected = (suggestion: LocationSuggestion): SelectedLocation => ({
  displayName: suggestion.displayName,
  latitude: suggestion.latitude,
  longitude: suggestion.longitude,
})

function App() {
  const [units, setUnits] = useState<UnitSystem>('metric')
  const [mobileWeatherOpen, setMobileWeatherOpen] = useState(false)

  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')
  const [startSelected, setStartSelected] = useState<SelectedLocation>()
  const [endSelected, setEndSelected] = useState<SelectedLocation>()
  const [startSelectedId, setStartSelectedId] = useState<string>()
  const [endSelectedId, setEndSelectedId] = useState<string>()

  const startGeocoding = useGeocoding(startQuery)
  const endGeocoding = useGeocoding(endQuery)

  const { route, loading: routeLoading, error: routeError, findRoute, clearRoute } = useRoute()
  const { weatherPoints, selectedId, setSelectedId } = useRouteWeather(route)

  const selectedPoint = useMemo(() => weatherPoints.find((point) => point.id === selectedId), [weatherPoints, selectedId])

  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <Header units={units} onUnitsChange={setUnits} />
      <main className='mx-auto flex max-w-screen-2xl flex-col gap-4 p-4 md:flex-row'>
        <RoutePanel
          start={{
            query: startQuery,
            selected: startSelected,
            selectedId: startSelectedId,
            suggestions: startGeocoding.results,
            loading: startGeocoding.loading,
            error: startGeocoding.error,
          }}
          end={{
            query: endQuery,
            selected: endSelected,
            selectedId: endSelectedId,
            suggestions: endGeocoding.results,
            loading: endGeocoding.loading,
            error: endGeocoding.error,
          }}
          onStartQueryChange={(value) => {
            setStartQuery(value)
            setStartSelected(undefined)
            setStartSelectedId(undefined)
          }}
          onEndQueryChange={(value) => {
            setEndQuery(value)
            setEndSelected(undefined)
            setEndSelectedId(undefined)
          }}
          onStartSelect={(value) => {
            setStartQuery(value.displayName)
            setStartSelected(mapSuggestionToSelected(value))
            setStartSelectedId(value.id)
          }}
          onEndSelect={(value) => {
            setEndQuery(value.displayName)
            setEndSelected(mapSuggestionToSelected(value))
            setEndSelectedId(value.id)
          }}
          onSwap={() => {
            const nextStartQuery = endQuery
            const nextStartSelected = endSelected
            const nextStartSelectedId = endSelectedId
            setEndQuery(startQuery)
            setEndSelected(startSelected)
            setEndSelectedId(startSelectedId)
            setStartQuery(nextStartQuery)
            setStartSelected(nextStartSelected)
            setStartSelectedId(nextStartSelectedId)
          }}
          onFindRoute={() => {
            if (!startSelected || !endSelected) return
            void findRoute(startSelected, endSelected)
          }}
          route={route}
          loading={routeLoading}
          error={routeError}
        />

        <div className='flex min-w-0 flex-1 gap-4'>
          <RouteMap
            start={startSelected}
            end={endSelected}
            route={route}
            weatherPoints={weatherPoints}
            selectedWeatherId={selectedId}
            onSelectWeatherPoint={setSelectedId}
            onHoverRoute={setSelectedId}
            onClearRoute={() => {
              clearRoute()
              setSelectedId(undefined)
            }}
            onOpenMobileWeather={() => setMobileWeatherOpen(true)}
          />

          <WeatherSidebar
            point={selectedPoint}
            units={units}
            hasRoute={Boolean(route)}
            openOnMobile={mobileWeatherOpen}
            onCloseMobile={() => setMobileWeatherOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
