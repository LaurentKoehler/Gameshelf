import { useEffect, useState } from 'react'

const STORAGE_KEY = 'gameshelf-library'

// Manages the game library and keeps it in sync with localStorage, so it
// survives page reloads. The library is loaded once on mount (lazy initial
// state) and re-saved every time it changes.
export function useLibrary() {
  const [library, setLibrary] = useState(readLibrary)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  }, [library])

  function addGame(game, status) {
    setLibrary((current) => {
      const alreadyThere = current.some((entry) => entry.id === game.id)
      if (alreadyThere) return current

      const newEntry = {
        id: game.id,
        title: game.title,
        cover: game.cover,
        released: game.released,
        genres: game.genres,
        platforms: game.platforms,
        metacritic: game.metacritic,
        status,
        rating: null,
        addedAt: new Date().toISOString().slice(0, 10),
        finishedAt: null,
      }
      return [...current, newEntry]
    })
  }

  function isInLibrary(id) {
    return library.some((entry) => entry.id === id)
  }

  return { library, addGame, isInLibrary }
}

function readLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
