import { useEffect, useState } from 'react'
import { searchLocations } from '../services/geocodingService'
import type { LocationSuggestion } from '../types/location'
import { useDebouncedValue } from './useDebouncedValue'

export const useGeocoding = (query: string): { results: LocationSuggestion[]; loading: boolean; error?: string } => {
  const [results, setResults] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const debouncedQuery = useDebouncedValue(query, 400)

  useEffect(() => {
    const controller = new AbortController()

    if (debouncedQuery.trim().length < 2) {
      setResults([])
      setError(undefined)
      setLoading(false)
      return () => controller.abort()
    }

    setLoading(true)
    setError(undefined)

    searchLocations(debouncedQuery, controller.signal)
      .then((payload) => setResults(payload))
      .catch((fetchError: Error) => {
        if (controller.signal.aborted) return
        setError(fetchError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [debouncedQuery])

  return { results, loading, error }
}
