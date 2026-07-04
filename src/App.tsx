import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GameModal from './components/GameModal'
import GameCard from './components/GameCard'
import { useLibrary } from './hooks/useLibrary'
import type { GameStatus, SearchResult } from './types'

function App() {
  const [selectedGame, setSelectedGame] = useState<SearchResult | null>(null)
  const { library, addGame, isInLibrary, updateStatus, setRating, deleteGame } = useLibrary()

  function handleAddGame(game: SearchResult, status: GameStatus) {
    addGame(game, status)
    setSelectedGame(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSelectGame={setSelectedGame} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {library.length === 0 ? (
          <p className="text-center text-base-content/60">
            Ta bibliothèque est vide. Recherche un jeu pour l'ajouter !
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {library.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onUpdateStatus={updateStatus}
                onSetRating={setRating}
                onDelete={deleteGame}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <GameModal
        game={selectedGame}
        alreadyInLibrary={selectedGame ? isInLibrary(selectedGame.id) : false}
        onClose={() => setSelectedGame(null)}
        onAdd={handleAddGame}
      />
    </div>
  )
}

export default App
