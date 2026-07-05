import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GameModal from './components/GameModal'
import GameCard from './components/GameCard'
import FilterBar from './components/FilterBar'
import StatsPage from './components/StatsPage'
import Toast from './components/Toast'
import { useLibrary } from './hooks/useLibrary'
import { useToast } from './hooks/useToast'
import { countByStatus, getAvailableGenres, selectGames } from './filters'
import type { SortOption, StatusFilter } from './filters'
import type { GameStatus, SearchResult, View } from './types'

function App() {
  const [selectedGame, setSelectedGame] = useState<SearchResult | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [genreFilter, setGenreFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('addedAt')
  const [view, setView] = useState<View>('library')
  const { library, addGame, isInLibrary, updateStatus, setRating, deleteGame } = useLibrary()
  const { message: toastMessage, showToast } = useToast()

  function handleAddGame(game: SearchResult, status: GameStatus) {
    addGame(game, status)
    setSelectedGame(null)
    showToast(`« ${game.title} » ajouté à la bibliothèque.`)
  }

  function handleDeleteGame(id: number) {
    const game = library.find((entry) => entry.id === id)
    deleteGame(id)
    if (game) showToast(`« ${game.title} » supprimé de la bibliothèque.`)
  }

  const visibleGames = selectGames(library, { status: statusFilter, genre: genreFilter, sortBy })

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSelectGame={setSelectedGame} currentView={view} onNavigate={setView} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {view === 'stats' ? (
          <StatsPage library={library} />
        ) : library.length === 0 ? (
          <p className="text-center text-base-content/60">
            Ta bibliothèque est vide. Recherche un jeu pour l'ajouter !
          </p>
        ) : (
          <>
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              counts={countByStatus(library)}
              genres={getAvailableGenres(library)}
              genreFilter={genreFilter}
              onGenreFilterChange={setGenreFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            {visibleGames.length === 0 ? (
              <p className="text-center text-base-content/60">
                Aucun jeu ne correspond à ces filtres.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {visibleGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onUpdateStatus={updateStatus}
                    onSetRating={setRating}
                    onDelete={handleDeleteGame}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <GameModal
        game={selectedGame}
        alreadyInLibrary={selectedGame ? isInLibrary(selectedGame.id) : false}
        onClose={() => setSelectedGame(null)}
        onAdd={handleAddGame}
      />

      <Toast message={toastMessage} />
    </div>
  )
}

export default App
