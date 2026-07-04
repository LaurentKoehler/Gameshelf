import type { ChangeEvent } from 'react'
import { STATUSES } from '../types'
import type { Game, GameStatus } from '../types'

const STATUS_LABELS: Record<GameStatus, string> = {
  wishlist: 'Wishlist',
  backlog: 'À faire',
  playing: 'En cours',
  finished: 'Terminé',
  dropped: 'Abandonné',
}

const STATUS_BADGE_CLASSES: Record<GameStatus, string> = {
  wishlist: 'badge-info',
  backlog: 'badge-neutral',
  playing: 'badge-primary',
  finished: 'badge-success',
  dropped: 'badge-error',
}

// 1 to 10, for the rating <select>.
const RATING_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1)

interface GameCardProps {
  game: Game
  onUpdateStatus: (id: number, status: GameStatus) => void
  onSetRating: (id: number, rating: number | null) => void
  onDelete: (id: number) => void
}

function GameCard({ game, onUpdateStatus, onSetRating, onDelete }: GameCardProps) {
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onUpdateStatus(game.id, event.target.value as GameStatus)
  }

  function handleRatingChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    onSetRating(game.id, value === '' ? null : Number(value))
  }

  function handleDelete() {
    const confirmed = window.confirm(`Supprimer "${game.title}" de la bibliothèque ?`)
    if (confirmed) onDelete(game.id)
  }

  return (
    <div className="card bg-base-200 shadow">
      <figure className="h-40 bg-base-300">
        {game.cover ? (
          <img src={game.cover} alt={game.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" />
        )}
      </figure>

      <div className="card-body gap-2 p-4">
        <h3 className="card-title text-base">{game.title}</h3>
        <span className={`badge w-fit ${STATUS_BADGE_CLASSES[game.status]}`}>
          {STATUS_LABELS[game.status]}
        </span>

        <select
          aria-label="Statut"
          className="select select-bordered select-sm"
          value={game.status}
          onChange={handleStatusChange}
        >
          {STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Note"
          className="select select-bordered select-sm"
          value={game.rating ?? ''}
          onChange={handleRatingChange}
        >
          <option value="">Pas de note</option>
          {RATING_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}/10
            </option>
          ))}
        </select>

        <button type="button" className="btn btn-error btn-sm" onClick={handleDelete}>
          Supprimer
        </button>
      </div>
    </div>
  )
}

export default GameCard
