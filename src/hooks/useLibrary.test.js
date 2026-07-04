import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLibrary } from './useLibrary'

const STORAGE_KEY = 'gameshelf-library'

const sampleGame = {
  id: 1,
  title: 'Elden Ring',
  cover: 'https://example.com/cover.jpg',
  released: '2022-02-25',
  genres: ['Action', 'RPG'],
  platforms: ['PC', 'PS5'],
  metacritic: 96,
}

beforeEach(() => {
  localStorage.clear()
})

describe('useLibrary', () => {
  it('starts empty when nothing is stored yet', () => {
    const { result } = renderHook(() => useLibrary())

    expect(result.current.library).toEqual([])
  })

  it('adds a game with the chosen status and default fields', () => {
    const { result } = renderHook(() => useLibrary())

    act(() => {
      result.current.addGame(sampleGame, 'playing')
    })

    expect(result.current.library).toHaveLength(1)
    expect(result.current.library[0]).toMatchObject({
      id: sampleGame.id,
      title: sampleGame.title,
      status: 'playing',
      rating: null,
      finishedAt: null,
    })
  })

  it('does not add the same game twice (duplicate prevention)', () => {
    const { result } = renderHook(() => useLibrary())

    act(() => {
      result.current.addGame(sampleGame, 'backlog')
      result.current.addGame(sampleGame, 'playing')
    })

    expect(result.current.library).toHaveLength(1)
    expect(result.current.library[0].status).toBe('backlog')
  })

  it('reports whether a game is already in the library', () => {
    const { result } = renderHook(() => useLibrary())

    act(() => {
      result.current.addGame(sampleGame, 'backlog')
    })

    expect(result.current.isInLibrary(sampleGame.id)).toBe(true)
    expect(result.current.isInLibrary(999)).toBe(false)
  })

  it('persists added games to localStorage', () => {
    const { result } = renderHook(() => useLibrary())

    act(() => {
      result.current.addGame(sampleGame, 'backlog')
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(sampleGame.id)
  })

  it('loads an existing library from localStorage on init', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...sampleGame, status: 'finished', rating: 9, addedAt: '2026-01-01', finishedAt: '2026-02-01' }]),
    )

    const { result } = renderHook(() => useLibrary())

    expect(result.current.library).toHaveLength(1)
    expect(result.current.library[0].status).toBe('finished')
  })
})
