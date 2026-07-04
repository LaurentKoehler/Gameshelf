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

// "Relancé" (replaying) can only be reached from "Terminé" (finished): it's
// hidden from the picker for any other current status. It stays visible once
// a game is already "Relancé", so the <select> can keep showing that value.
export function getAvailableStatuses(currentStatus: GameStatus) {
  const canReplay = currentStatus === 'finished' || currentStatus === 'replaying'
  return STATUSES.filter((option) => option.value !== 'replaying' || canReplay)
}

// A game with a completion date that isn't currently "finished" or "replaying"
// was finished at some point in the past. No extra field is stored for this.
export function hasFinishedOnceMention(game: Pick<Game, 'status' | 'finishedAt'>) {
  return game.finishedAt != null && game.status !== 'finished' && game.status !== 'replaying'
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
