import { useEffect, useState } from 'react'
import type { Game, GameStatus, SearchResult } from '../types'

const STORAGE_KEY = 'gameshelf-library'

// Manages the game library and keeps it in sync with localStorage, so it
// survives page reloads. The library is loaded once on mount (lazy initial
// state) and re-saved every time it changes.
export function useLibrary() {
  const [library, setLibrary] = useState<Game[]>(readLibrary)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  }, [library])

  function addGame(game: SearchResult, status: GameStatus) {
    setLibrary((current) => {
      const alreadyThere = current.some((entry) => entry.id === game.id)
      if (alreadyThere) return current

      const newEntry: Game = {
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

  function isInLibrary(id: number) {
    return library.some((entry) => entry.id === id)
  }

  function updateStatus(id: number, status: GameStatus) {
    setLibrary((current) =>
      current.map((entry) => {
        if (entry.id !== id) return entry

        // finishedAt is set automatically the moment a game becomes "finished".
        const becameFinished = status === 'finished' && entry.status !== 'finished'
        return {
          ...entry,
          status,
          finishedAt: becameFinished ? new Date().toISOString().slice(0, 10) : entry.finishedAt,
        }
      }),
    )
  }

  function setRating(id: number, rating: number | null) {
    setLibrary((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, rating } : entry)),
    )
  }

  function deleteGame(id: number) {
    setLibrary((current) => current.filter((entry) => entry.id !== id))
  }

  return { library, addGame, isInLibrary, updateStatus, setRating, deleteGame }
}

function readLibrary(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
