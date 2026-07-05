import { useEffect, useState } from 'react'
import { searchGames } from '../api/rawg'
import { useDebounce } from './useDebounce'
import type { SearchResult } from '../types'

const DEBOUNCE_DELAY = 400

// US-1: search only triggers from 2 characters onward.
export const MIN_QUERY_LENGTH = 2

// Searches RAWG games as the user types. The query is debounced, and a stale
// request (from a previous keystroke) is aborted if a newer one starts.
export function useGameSearch(query: string) {
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY)
  const [results, setResults] = useState<SearchResult[]>([])
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim()
    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
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
      .finally(() => {
        // A stale (aborted) request settling later must not clear the
        // loading state of the newer request that superseded it.
        if (!controller.signal.aborted) setFetching(false)
      })

    return () => controller.abort()
  }, [debouncedQuery])

  // The debounced value hasn't caught up with what's typed yet: the fetch
  // above hasn't even started. Counting this as loading too avoids briefly
  // flashing "no results" right after a keystroke.
  const isWaitingForDebounce =
    query.trim().length >= MIN_QUERY_LENGTH && query.trim() !== debouncedQuery.trim()
  const loading = fetching || isWaitingForDebounce

  return { results, loading, error }
}
