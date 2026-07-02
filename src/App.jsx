import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GameModal from './components/GameModal'

function App() {
  const [selectedGame, setSelectedGame] = useState(null)

  function handleAddGame(game, status) {
    // TODO (step 3): persist the game to the library via useLibrary
    console.log('Adding game (persistence arrives in step 3):', game.title, status)
    setSelectedGame(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSelectGame={setSelectedGame} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* The game library will be displayed here (step 3) */}
        <p className="text-center text-base-content/60">
          La bibliothèque de jeux arrivera bientôt.
        </p>
      </main>

      <Footer />

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} onAdd={handleAddGame} />
    </div>
  )
}

export default App
