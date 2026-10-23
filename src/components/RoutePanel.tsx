import { ArrowUpDown, Route } from 'lucide-react'
import { useMemo } from 'react'
import type { SelectedLocation } from '../types/location'
import type { RouteResponse } from '../types/route'
import { formatDistance, formatDuration } from '../utils/units'
import { ErrorMessage } from './ErrorMessage'
import { LoadingState } from './LoadingState'
import { LocationSearch } from './LocationSearch'
import type { LocationSuggestion } from '../types/location'

type EndpointState = {
  query: string
  selected?: SelectedLocation
  selectedId?: string
  suggestions: LocationSuggestion[]
  loading: boolean
  error?: string
}

type RoutePanelProps = {
  start: EndpointState
  end: EndpointState
  onStartQueryChange: (value: string) => void
  onEndQueryChange: (value: string) => void
  onStartSelect: (value: LocationSuggestion) => void
  onEndSelect: (value: LocationSuggestion) => void
  onSwap: () => void
  onFindRoute: () => void
  route?: RouteResponse | null
  loading: boolean
  error?: string
}

export const RoutePanel = ({
  start,
  end,
  onStartQueryChange,
  onEndQueryChange,
  onStartSelect,
  onEndSelect,
  onSwap,
  onFindRoute,
  route,
  loading,
  error,
}: RoutePanelProps) => {
  const validationError = useMemo(() => {
    if (!start.query.trim() || !end.query.trim()) return 'Enter both start and destination.'
    if (!start.selected || !end.selected) return 'Select valid suggestions for both locations.'
    return undefined
  }, [end.query, end.selected, start.query, start.selected])

  return (
    <aside className='w-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 md:w-96'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-base font-semibold text-slate-900'>
          <Route className='h-4 w-4' /> Route Planner
        </h2>
        <button
          type='button'
          onClick={onSwap}
          className='rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
          aria-label='Swap start and destination'
        >
          <ArrowUpDown className='h-4 w-4' />
        </button>
      </div>

      <LocationSearch
        label='Starting location'
        value={start.query}
        onChange={onStartQueryChange}
        suggestions={start.suggestions}
        loading={start.loading}
        error={start.error}
        selectedId={start.selectedId}
        onSelect={onStartSelect}
      />

      <LocationSearch
        label='Destination'
        value={end.query}
        onChange={onEndQueryChange}
        suggestions={end.suggestions}
        loading={end.loading}
        error={end.error}
        selectedId={end.selectedId}
        onSelect={onEndSelect}
      />

      <button
        type='button'
        onClick={onFindRoute}
        disabled={loading || !!validationError}
        className='w-full rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Find Route
      </button>

      <ErrorMessage message={validationError ?? error} />
      {loading ? <LoadingState label='Calculating route...' /> : null}

      {route ? (
        <div className='space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700'>
          <p>
            <span className='font-medium text-slate-900'>Distance:</span> {formatDistance(route.distanceMeters / 1000)}
          </p>
          <p>
            <span className='font-medium text-slate-900'>Estimated travel:</span> {formatDuration(route.durationSeconds)}
          </p>
        </div>
      ) : null}
    </aside>
  )
}
