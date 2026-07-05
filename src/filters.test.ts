import { describe, it, expect } from 'vitest'
import {
  countByStatus,
  filterByGenre,
  filterByStatus,
  getAvailableGenres,
  selectGames,
  sortGames,
} from './filters'
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

const games: Game[] = [
  makeGame({
    id: 1,
    title: 'Elden Ring',
    genres: ['Action', 'RPG'],
    status: 'playing',
    rating: 9,
    metacritic: 96,
    addedAt: '2026-01-10',
  }),
  makeGame({
    id: 2,
    title: 'Celeste',
    genres: ['Platformer'],
    status: 'finished',
    rating: null,
    metacritic: 92,
    addedAt: '2026-02-01',
  }),
  makeGame({
    id: 3,
    title: 'Alba',
    genres: ['Adventure'],
    status: 'wishlist',
    rating: 7,
    metacritic: null,
    addedAt: '2026-01-20',
  }),
  makeGame({
    id: 4,
    title: 'Breath of the Wild',
    genres: ['Action', 'Adventure'],
    status: 'replaying',
    rating: 10,
    metacritic: 97,
    addedAt: '2026-01-05',
  }),
]

describe('filterByStatus', () => {
  it('returns every game for "all"', () => {
    expect(filterByStatus(games, 'all')).toHaveLength(4)
  })

  it('returns only games matching the given status', () => {
    expect(filterByStatus(games, 'playing').map((g) => g.id)).toEqual([1])
  })

  it('matches "replaying" as its own status', () => {
    expect(filterByStatus(games, 'replaying').map((g) => g.id)).toEqual([4])
  })
})

describe('filterByGenre', () => {
  it('returns every game when no genre is picked', () => {
    expect(filterByGenre(games, null)).toHaveLength(4)
  })

  it('returns only games that include the given genre', () => {
    expect(filterByGenre(games, 'Action').map((g) => g.id)).toEqual([1, 4])
  })
})

describe('getAvailableGenres', () => {
  it('derives a sorted, de-duplicated genre list from the games present', () => {
    expect(getAvailableGenres(games)).toEqual(['Action', 'Adventure', 'Platformer', 'RPG'])
  })

  it('returns an empty list for an empty library', () => {
    expect(getAvailableGenres([])).toEqual([])
  })
})

describe('countByStatus', () => {
  it('counts games per status, plus the "all" total', () => {
    expect(countByStatus(games)).toEqual({
      all: 4,
      wishlist: 1,
      backlog: 0,
      playing: 1,
      finished: 1,
      replaying: 1,
      dropped: 0,
    })
  })
})

describe('sortGames', () => {
  it('sorts by title alphabetically', () => {
    expect(sortGames(games, 'title').map((g) => g.title)).toEqual([
      'Alba',
      'Breath of the Wild',
      'Celeste',
      'Elden Ring',
    ])
  })

  it('sorts by rating, highest first, unrated last', () => {
    expect(sortGames(games, 'rating').map((g) => g.id)).toEqual([4, 1, 3, 2])
  })

  it('sorts by Metacritic, highest first, unrated last', () => {
    expect(sortGames(games, 'metacritic').map((g) => g.id)).toEqual([4, 1, 2, 3])
  })

  it('sorts by date added, most recent first', () => {
    expect(sortGames(games, 'addedAt').map((g) => g.id)).toEqual([2, 3, 1, 4])
  })

  it('does not mutate the original array', () => {
    const original = [...games]
    sortGames(games, 'title')
    expect(games).toEqual(original)
  })
})

describe('selectGames', () => {
  it('combines status, genre, and sort (US-5)', () => {
    const result = selectGames(games, { status: 'all', genre: 'Action', sortBy: 'rating' })

    expect(result.map((g) => g.id)).toEqual([4, 1])
  })

  it('returns an empty array when the combined filters match nothing', () => {
    const result = selectGames(games, { status: 'dropped', genre: null, sortBy: 'title' })

    expect(result).toEqual([])
  })
})
