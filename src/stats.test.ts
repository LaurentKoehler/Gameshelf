import { describe, it, expect } from 'vitest'
import {
  computeCounters,
  computeFinishedPerMonth,
  computeGenreDistribution,
  computeStatusDistribution,
} from './stats'
import type { Game } from './types'

function makeGame(overrides: Partial<Game>): Game {
  return {
    id: 1,
    title: 'Untitled',
    cover: null,
    released: null,
    genres: [],
    platforms: [],
    metacritic: null,
    status: 'backlog',
    rating: null,
    addedAt: '2026-01-01',
    finishedAt: null,
    ...overrides,
  }
}

const NOW = new Date('2026-07-15T00:00:00.000Z')

describe('computeCounters', () => {
  it('counts the total number of games', () => {
    const games = [makeGame({ id: 1 }), makeGame({ id: 2 })]
    expect(computeCounters(games, NOW).total).toBe(2)
  })

  it('counts games finished this year by finishedAt, regardless of current status', () => {
    const games = [
      makeGame({ id: 1, status: 'finished', finishedAt: '2026-02-01' }),
      // Moved away from "finished" afterwards, but still finished this year (US-6).
      makeGame({ id: 2, status: 'dropped', finishedAt: '2026-05-01' }),
      makeGame({ id: 3, status: 'finished', finishedAt: '2025-12-31' }),
      makeGame({ id: 4, status: 'playing', finishedAt: null }),
    ]

    expect(computeCounters(games, NOW).finishedThisYear).toBe(2)
  })

  it('counts "playing" and "replaying" as currently playing', () => {
    const games = [
      makeGame({ id: 1, status: 'playing' }),
      makeGame({ id: 2, status: 'replaying' }),
      makeGame({ id: 3, status: 'finished' }),
      makeGame({ id: 4, status: 'wishlist' }),
    ]

    expect(computeCounters(games, NOW).currentlyPlaying).toBe(2)
  })

  it('averages only the rated games', () => {
    const games = [
      makeGame({ id: 1, rating: 8 }),
      makeGame({ id: 2, rating: 6 }),
      makeGame({ id: 3, rating: null }),
    ]

    expect(computeCounters(games, NOW).averageRating).toBe(7)
  })

  it('returns null average rating when no game is rated', () => {
    const games = [makeGame({ id: 1, rating: null })]
    expect(computeCounters(games, NOW).averageRating).toBeNull()
  })

  it('compares the current year in UTC, unaffected by the local timezone', () => {
    const originalTZ = process.env.TZ
    // UTC-8: this UTC instant is still Dec 31 2025 locally, but Jan 1 2026 in UTC.
    process.env.TZ = 'America/Los_Angeles'
    try {
      const now = new Date('2026-01-01T03:00:00.000Z')
      const games = [makeGame({ id: 1, finishedAt: '2026-01-01' })]

      expect(computeCounters(games, now).finishedThisYear).toBe(1)
    } finally {
      process.env.TZ = originalTZ
    }
  })
})

describe('computeFinishedPerMonth', () => {
  it('returns 12 months ending at the reference month', () => {
    const result = computeFinishedPerMonth([], NOW)
    expect(result).toHaveLength(12)
  })

  it('counts a finished game in its completion month, regardless of current status', () => {
    const games = [
      makeGame({ id: 1, status: 'dropped', finishedAt: '2026-07-10' }),
      makeGame({ id: 2, status: 'finished', finishedAt: '2026-06-01' }),
    ]

    const result = computeFinishedPerMonth(games, NOW)

    expect(result[result.length - 1].count).toBe(1) // July 2026 (current month)
    expect(result[result.length - 2].count).toBe(1) // June 2026
  })

  it('ignores games finished outside the 12-month window', () => {
    const games = [makeGame({ id: 1, finishedAt: '2024-01-01' })]

    const result = computeFinishedPerMonth(games, NOW)

    expect(result.reduce((sum, month) => sum + month.count, 0)).toBe(0)
  })

  it('ignores games with no finishedAt', () => {
    const games = [makeGame({ id: 1, finishedAt: null })]

    const result = computeFinishedPerMonth(games, NOW)

    expect(result.reduce((sum, month) => sum + month.count, 0)).toBe(0)
  })
})

describe('computeStatusDistribution', () => {
  it('returns one entry per status present, with its exact count', () => {
    const games = [
      makeGame({ id: 1, status: 'playing' }),
      makeGame({ id: 2, status: 'playing' }),
      makeGame({ id: 3, status: 'wishlist' }),
    ]

    expect(computeStatusDistribution(games)).toEqual([
      { status: 'wishlist', label: 'Wishlist', count: 1 },
      { status: 'playing', label: 'En cours', count: 2 },
    ])
  })

  it('omits statuses with no games', () => {
    const games = [makeGame({ id: 1, status: 'finished' })]

    const result = computeStatusDistribution(games)

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('finished')
  })

  it('returns an empty list for an empty library', () => {
    expect(computeStatusDistribution([])).toEqual([])
  })
})

describe('computeGenreDistribution', () => {
  it('counts a game once per genre it has', () => {
    const games = [
      makeGame({ id: 1, genres: ['Action', 'RPG'] }),
      makeGame({ id: 2, genres: ['Action'] }),
      makeGame({ id: 3, genres: ['RPG'] }),
    ]

    expect(computeGenreDistribution(games)).toEqual([
      { genre: 'Action', count: 2 },
      { genre: 'RPG', count: 2 },
    ])
  })

  it('sorts by count, descending', () => {
    const games = [
      makeGame({ id: 1, genres: ['Platformer'] }),
      makeGame({ id: 2, genres: ['Action'] }),
      makeGame({ id: 3, genres: ['Action'] }),
    ]

    expect(computeGenreDistribution(games).map((g) => g.genre)).toEqual(['Action', 'Platformer'])
  })

  it('returns an empty list when no game has genres', () => {
    expect(computeGenreDistribution([makeGame({ id: 1, genres: [] })])).toEqual([])
  })
})
