export type GameStatus = 'wishlist' | 'backlog' | 'playing' | 'finished' | 'dropped'

// Shared list of statuses with their French label, used to populate <select> options.
export const STATUSES: { value: GameStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'backlog', label: 'À faire' },
  { value: 'playing', label: 'En cours' },
  { value: 'finished', label: 'Terminé' },
  { value: 'dropped', label: 'Abandonné' },
]

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
