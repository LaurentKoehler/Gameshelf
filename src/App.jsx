import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* La bibliothèque de jeux sera affichée ici (étape 3) */}
        <p className="text-center text-base-content/60">
          La bibliothèque de jeux arrivera bientôt.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default App
