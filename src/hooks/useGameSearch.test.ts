import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useGameSearch } from './useGameSearch'
import { searchGames } from '../api/rawg'
import type { SearchResult } from '../types'

vi.mock('../api/rawg', () => ({
  searchGames: vi.fn(),
}))

const mockedSearchGames = vi.mocked(searchGames)

beforeEach(() => {
  mockedSearchGames.mockReset()
  mockedSearchGames.mockResolvedValue([])
})

describe('useGameSearch', () => {
  it('does not search below the 2-character minimum (US-1)', () => {
    renderHook(() => useGameSearch('a'))

    expect(mockedSearchGames).not.toHaveBeenCalled()
  })

  it('searches once the query reaches 2 characters', () => {
    renderHook(() => useGameSearch('ze'))

    expect(mockedSearchGames).toHaveBeenCalledWith('ze', expect.anything())
  })

  it('does not clear loading when a stale request settles after a newer one starts', async () => {
    let resolveFirst!: (value: SearchResult[]) => void
    let resolveSecond!: (value: SearchResult[]) => void
    const firstPromise = new Promise<SearchResult[]>((resolve) => {
      resolveFirst = resolve
    })
    const secondPromise = new Promise<SearchResult[]>((resolve) => {
      resolveSecond = resolve
    })

    mockedSearchGames.mockImplementationOnce(() => firstPromise)
    mockedSearchGames.mockImplementationOnce(() => secondPromise)

    const { result, rerender } = renderHook(({ query }) => useGameSearch(query), {
      initialProps: { query: 'ze' },
    })

    expect(mockedSearchGames).toHaveBeenCalledTimes(1)
    expect(result.current.loading).toBe(true)

    // A newer query comes in before the first request settles.
    rerender({ query: 'zel' })
    await waitFor(() => expect(mockedSearchGames).toHaveBeenCalledTimes(2), { timeout: 2000 })
    expect(result.current.loading).toBe(true)

    // The stale (first) request settles late. It must not clear loading:
    // the second, current request is still pending.
    await act(async () => {
      resolveFirst([])
      await Promise.resolve()
    })
    expect(result.current.loading).toBe(true)

    // The current request settles: loading can now clear.
    await act(async () => {
      resolveSecond([])
      await Promise.resolve()
    })
    expect(result.current.loading).toBe(false)
  })
})
