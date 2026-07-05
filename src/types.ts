export type GameStatus = 'wishlist' | 'backlog' | 'playing' | 'finished' | 'replaying' | 'dropped'

// Shared list of statuses with their French label, used to populate <select> options.
export const STATUSES: { value: GameStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'backlog', label: 'À faire' },
  { value: 'playing', label: 'En cours' },
  { value: 'finished', label: 'Terminé' },
  { value: 'replaying', label: 'Relancé' },
  { value: 'dropped', label: 'Abandonné' },
]

// Looks up a status's French label. STATUSES covers every GameStatus value,
// so the lookup always finds a match.
export function getStatusLabel(status: GameStatus): string {
  return STATUSES.find((option) => option.value === status)!.label
}

// True while a game's completion date is meaningful right now (it's finished
// or replaying it).
function isCompletedStatus(status: GameStatus): boolean {
  return status === 'finished' || status === 'replaying'
}

// "Relancé" (replaying) can only be reached from "Terminé" (finished): it's
// hidden from the picker for any other current status. It stays visible once
// a game is already "Relancé", so the <select> can keep showing that value.
export function getAvailableStatuses(currentStatus: GameStatus) {
  return STATUSES.filter((option) => option.value !== 'replaying' || isCompletedStatus(currentStatus))
}

// A game with a completion date that isn't currently "finished" or "replaying"
// was finished at some point in the past. No extra field is stored for this.
export function hasFinishedOnceMention(game: Pick<Game, 'status' | 'finishedAt'>) {
  return game.finishedAt != null && !isCompletedStatus(game.status)
}

// Shows a card's "Terminé le ..." date only while the completion is current
// (finished or replaying).
export function shouldShowCompletionDate(game: Pick<Game, 'status' | 'finishedAt'>) {
  return game.finishedAt != null && isCompletedStatus(game.status)
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC' })

// Formats an ISO date string (e.g. "2026-03-15") as "15/03/2026". UTC is
// forced so the date doesn't shift by a day depending on the reader's timezone.
export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

// A game as found through RAWG search, before it's added to the library.
export interface SearchResult {
  id: number
  title: string
  cover: string | null
  released: string | null
  genres: string[]
  platforms: string[]
  metacritic: number | null
}

// A game saved in the library (stored in localStorage under the key `gameshelf-library`).
export interface Game extends SearchResult {
  status: GameStatus
  rating: number | null
  addedAt: string
  finishedAt: string | null
}
