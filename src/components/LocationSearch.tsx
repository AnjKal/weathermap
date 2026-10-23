import type { LocationSuggestion } from '../types/location'
import { ErrorMessage } from './ErrorMessage'

type LocationSearchProps = {
  label: string
  value: string
  onChange: (value: string) => void
  suggestions: LocationSuggestion[]
  loading: boolean
  error?: string
  selectedId?: string
  onSelect: (suggestion: LocationSuggestion) => void
}

export const LocationSearch = ({
  label,
  value,
  onChange,
  suggestions,
  loading,
  error,
  selectedId,
  onSelect,
}: LocationSearchProps) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-slate-700'>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
        placeholder='Search city, address, landmark'
      />
    </label>
    {loading ? <p className='text-xs text-slate-500'>Searching…</p> : null}
    <ErrorMessage message={error} />
    {suggestions.length > 0 ? (
      <ul className='max-h-44 overflow-auto rounded-md border border-slate-200 bg-white'>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type='button'
              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 ${selectedId === suggestion.id ? 'bg-brand-50' : ''}`}
              onClick={() => onSelect(suggestion)}
            >
              <p className='font-medium text-slate-900'>{suggestion.displayName}</p>
              {suggestion.subtitle ? <p className='text-xs text-slate-600'>{suggestion.subtitle}</p> : null}
            </button>
          </li>
        ))}
      </ul>
    ) : null}
  </div>
)
