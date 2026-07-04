import { useState } from 'react'

const STATUSES = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'backlog', label: 'À faire' },
  { value: 'playing', label: 'En cours' },
  { value: 'finished', label: 'Terminé' },
  { value: 'dropped', label: 'Abandonné' },
]

function GameModal({ game, alreadyInLibrary, onClose, onAdd }) {
  const [status, setStatus] = useState(STATUSES[0].value)

  if (!game) return null

  return (
    // Clicking the dimmed backdrop closes the modal; stopPropagation keeps
    // clicks inside the box from bubbling up and closing it too.
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        {game.cover ? (
          <img
            src={game.cover}
            alt={game.title}
            className="mb-4 h-48 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="mb-4 h-48 w-full rounded-lg bg-base-300" />
        )}

        <h3 className="text-lg font-bold">{game.title}</h3>
        <p className="text-sm text-base-content/70">
          {game.released ? game.released.slice(0, 4) : 'Année inconnue'}
          {game.platforms.length > 0 && ` · ${game.platforms.join(', ')}`}
        </p>
        {game.genres.length > 0 && (
          <p className="mt-1 text-sm text-base-content/70">{game.genres.join(', ')}</p>
        )}
        {game.metacritic != null && (
          <p className="mt-1 text-sm text-base-content/70">Metacritic : {game.metacritic}</p>
        )}

        {!alreadyInLibrary && (
          <div className="form-control mt-4">
            <label className="label" htmlFor="game-status">
              <span className="label-text">Statut</span>
            </label>
            <select
              id="game-status"
              className="select select-bordered"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            {alreadyInLibrary ? 'Fermer' : 'Annuler'}
          </button>
          {alreadyInLibrary ? (
            <span className="btn btn-disabled">Déjà dans la bibliothèque</span>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => onAdd(game, status)}>
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameModal
