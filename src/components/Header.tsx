import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { MIN_QUERY_LENGTH, useGameSearch } from '../hooks/useGameSearch'
import type { SearchResult, View } from '../types'

interface HeaderProps {
  onSelectGame: (game: SearchResult) => void
  currentView: View
  onNavigate: (view: View) => void
}

function Header({ onSelectGame, currentView, onNavigate }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { results, loading, error } = useGameSearch(query)

  const showDropdown = isFocused && query.trim().length >= MIN_QUERY_LENGTH

  function handleSelect(game: SearchResult) {
    onSelectGame(game)
    setQuery('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Blur (rather than just flipping isFocused) so the input's real focus
    // state stays in sync: otherwise a click while it's already focused
    // wouldn't re-fire onFocus, and the dropdown could never reopen.
    if (event.key === 'Escape') event.currentTarget.blur()
  }

  return (
    <header className="navbar flex-wrap gap-2 bg-base-200 px-4 py-2 md:px-8">
      <div className="flex flex-1 flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-xl font-bold text-primary">🎮 GameShelf</span>

        <nav className="flex gap-2">
          <button
            type="button"
            className={`btn btn-sm ${currentView === 'library' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onNavigate('library')}
          >
            Bibliothèque
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentView === 'stats' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onNavigate('stats')}
          >
            Stats
          </button>
        </nav>
      </div>

      <div className="relative w-full flex-none sm:w-auto sm:max-w-xs">
        <input
          type="search"
          placeholder="Rechercher un jeu..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full"
        />

        {showDropdown && (
          // onMouseDown prevents the input's onBlur from firing before a click
          // on a result is registered.
          <ul
            className="menu absolute z-10 mt-1 w-full rounded-box bg-base-100 shadow-lg"
            onMouseDown={(event) => event.preventDefault()}
          >
            {loading && (
              <li className="items-center p-3">
                <span className="loading loading-spinner loading-sm"></span>
              </li>
            )}

            {!loading && error && (
              <li className="p-3 text-sm text-error">Erreur réseau, réessaie plus tard.</li>
            )}

            {!loading && !error && results.length === 0 && (
              <li className="p-3 text-sm text-base-content/60">Aucun résultat.</li>
            )}

            {!loading &&
              !error &&
              results.map((game) => (
                <li key={game.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(game)}
                    className="flex items-center gap-3"
                  >
                    {game.cover ? (
                      <img src={game.cover} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-base-300" />
                    )}
                    <span className="flex flex-col items-start overflow-hidden">
                      <span className="truncate font-medium">{game.title}</span>
                      <span className="truncate text-xs text-base-content/60">
                        {game.released ? game.released.slice(0, 4) : 'Année inconnue'}
                        {game.platforms.length > 0 && ` · ${game.platforms.join(', ')}`}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </header>
  )
}

export default Header
