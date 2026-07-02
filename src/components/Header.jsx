function Header() {
  return (
    <header className="navbar bg-base-200 px-4 md:px-8">
      <div className="flex-1">
        <span className="text-xl font-bold text-primary">🎮 GameShelf</span>
      </div>
      <div className="flex-none w-full max-w-xs">
        {/* Search bar: wired to the RAWG API in step 2 */}
        <input
          type="search"
          placeholder="Rechercher un jeu..."
          disabled
          className="input input-bordered w-full"
        />
      </div>
    </header>
  )
}

export default Header
