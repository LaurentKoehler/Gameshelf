import { useEffect, useState } from 'react'
import { searchGames } from '../api/rawg'
import { useDebounce } from './useDebounce'
import type { SearchResult } from '../types'

const DEBOUNCE_DELAY = 400

// Searches RAWG games as the user types. The query is debounced, and a stale
// request (from a previous keystroke) is aborted if a newer one starts.
export function useGameSearch(query: string) {
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY)
  const [results, setResults] = useState<SearchResult[]>([])
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim()
    if (!trimmedQuery) {
      setResults([])
      setError(null)
      return
    }

    const controller = new AbortController()
    setFetching(true)
    setError(null)

    searchGames(trimmedQuery, { signal: controller.signal })
      .then(setResults)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setFetching(false))

    return () => controller.abort()
  }, [debouncedQuery])

  // The debounced value hasn't caught up with what's typed yet: the fetch
  // above hasn't even started. Counting this as loading too avoids briefly
  // flashing "no results" right after a keystroke.
  const isWaitingForDebounce = query.trim() !== '' && query.trim() !== debouncedQuery.trim()
  const loading = fetching || isWaitingForDebounce

  return { results, loading, error }
}
