import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGameSearch } from './useGameSearch'
import { searchGames } from '../api/rawg'

vi.mock('../api/rawg', () => ({
  searchGames: vi.fn(),
}))

const mockedSearchGames = vi.mocked(searchGames)

beforeEach(() => {
  vi.useFakeTimers()
  mockedSearchGames.mockReset()
  mockedSearchGames.mockResolvedValue([])
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useGameSearch', () => {
  it('does not search below the 2-character minimum (US-1)', async () => {
    renderHook(() => useGameSearch('a'))

    await vi.advanceTimersByTimeAsync(400)

    expect(mockedSearchGames).not.toHaveBeenCalled()
  })

  it('searches once the query reaches 2 characters', async () => {
    renderHook(() => useGameSearch('ze'))

    await vi.advanceTimersByTimeAsync(400)

    expect(mockedSearchGames).toHaveBeenCalledWith('ze', expect.anything())
  })
})
