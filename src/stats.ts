import type { Game } from './types'

export interface StatsCounters {
  total: number
  finishedThisYear: number
  currentlyPlaying: number
  averageRating: number | null
}

// All counters use finishedAt / status as they are now — a game's
// completion year never changes retroactively just because it later moved
// to another status (US-4b, US-6).
export function computeCounters(games: Game[], now: Date = new Date()): StatsCounters {
  const currentYear = now.getFullYear()

  const finishedThisYear = games.filter(
    (game) => game.finishedAt != null && new Date(game.finishedAt).getUTCFullYear() === currentYear,
  ).length

  // "Currently playing" counts both "En cours" and "Relancé" (US-6 business rule).
  const currentlyPlaying = games.filter(
    (game) => game.status === 'playing' || game.status === 'replaying',
  ).length

  const ratedGames = games.filter((game) => game.rating != null)
  const averageRating =
    ratedGames.length === 0
      ? null
      : ratedGames.reduce((sum, game) => sum + (game.rating ?? 0), 0) / ratedGames.length

  return { total: games.length, finishedThisYear, currentlyPlaying, averageRating }
}

export interface MonthlyFinishedCount {
  month: string
  count: number
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
})

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

// Bar chart data: finished games per month over the last 12 months (rolling
// window ending at `now`), counting every game by its finishedAt regardless
// of its current status (US-6 business rule).
export function computeFinishedPerMonth(games: Game[], now: Date = new Date()): MonthlyFinishedCount[] {
  const months: { key: string; label: string; count: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1))
    months.push({ key: monthKey(date), label: monthFormatter.format(date), count: 0 })
  }

  for (const game of games) {
    if (game.finishedAt == null) continue
    const key = monthKey(new Date(game.finishedAt))
    const bucket = months.find((month) => month.key === key)
    if (bucket) bucket.count += 1
  }

  return months.map(({ label, count }) => ({ month: label, count }))
}

export interface GenreCount {
  genre: string
  count: number
}

// Donut chart data: how many games have each genre (a game with several
// genres is counted once per genre). Sorted by count, largest slice first.
export function computeGenreDistribution(games: Game[]): GenreCount[] {
  const counts = new Map<string, number>()
  for (const game of games) {
    for (const genre of game.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre))
}
