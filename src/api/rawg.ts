import type { SearchResult } from '../types'

const BASE_URL = 'https://api.rawg.io/api'
const API_KEY = import.meta.env.VITE_RAWG_API_KEY

// The subset of RAWG's game shape that we actually use.
interface RawgApiGame {
  id: number
  name: string
  background_image: string | null
  released: string | null
  metacritic: number | null
  genres?: { name: string }[]
  parent_platforms?: { platform: { name: string } }[]
}

// Searches games by name and maps RAWG's response to the shape used across the app.
// `signal` lets the caller cancel a request that's no longer needed (see useGameSearch).
export async function searchGames(
  query: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<SearchResult[]> {
  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=8`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`)
  }

  const data: { results: RawgApiGame[] } = await response.json()
  return data.results.map(mapGame)
}

function mapGame(game: RawgApiGame): SearchResult {
  return {
    id: game.id,
    title: game.name,
    cover: game.background_image,
    released: game.released,
    genres: game.genres?.map((genre) => genre.name) ?? [],
    platforms: game.parent_platforms?.map((entry) => entry.platform.name) ?? [],
    metacritic: game.metacritic ?? null,
  }
}
