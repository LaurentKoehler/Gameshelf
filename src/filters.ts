import type { Game, GameStatus } from './types'

export type StatusFilter = 'all' | GameStatus
export type SortOption = 'addedAt' | 'title' | 'rating' | 'metacritic'

export function filterByStatus(games: Game[], status: StatusFilter): Game[] {
  if (status === 'all') return games
  return games.filter((game) => game.status === status)
}

export function filterByGenre(games: Game[], genre: string | null): Game[] {
  if (!genre) return games
  return games.filter((game) => game.genres.includes(genre))
}

// The genre list is derived from the games actually present in the library (US-5).
export function getAvailableGenres(games: Game[]): string[] {
  const genres = new Set<string>()
  for (const game of games) {
    for (const genre of game.genres) genres.add(genre)
  }
  return [...genres].sort((a, b) => a.localeCompare(b))
}

// How many games match each status, plus the "all" total — used for the
// filter bar's per-status counters.
export function countByStatus(games: Game[]): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = {
    all: games.length,
    wishlist: 0,
    backlog: 0,
    playing: 0,
    finished: 0,
    replaying: 0,
    dropped: 0,
  }
  for (const game of games) counts[game.status] += 1
  return counts
}

export function sortGames(games: Game[], sortBy: SortOption): Game[] {
  const sorted = [...games]
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    case 'metacritic':
      return sorted.sort((a, b) => (b.metacritic ?? -1) - (a.metacritic ?? -1))
    case 'addedAt':
      return sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  }
}

// Filters and sorting combine (US-5 business rule): status, then genre, then sort.
export function selectGames(
  games: Game[],
  options: { status: StatusFilter; genre: string | null; sortBy: SortOption },
): Game[] {
  const filtered = filterByGenre(filterByStatus(games, options.status), options.genre)
  return sortGames(filtered, options.sortBy)
}
