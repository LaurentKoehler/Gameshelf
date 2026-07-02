const BASE_URL = 'https://api.rawg.io/api'
const API_KEY = import.meta.env.VITE_RAWG_API_KEY

// Searches games by name and maps RAWG's response to the shape used across the app.
// `signal` lets the caller cancel a request that's no longer needed (see useGameSearch).
export async function searchGames(query, { signal } = {}) {
  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=8`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`)
  }

  const data = await response.json()
  return data.results.map(mapGame)
}

function mapGame(game) {
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
