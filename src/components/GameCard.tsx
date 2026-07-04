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

interface GameCardProps {
  game: Game
}

function GameCard({ game }: GameCardProps) {
  return (
    <div className="card bg-base-200 shadow">
      <figure className="h-40 bg-base-300">
        {game.cover ? (
          <img src={game.cover} alt={game.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" />
        )}
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-base">{game.title}</h3>
        <span className={`badge w-fit ${STATUS_BADGE_CLASSES[game.status]}`}>
          {STATUS_LABELS[game.status]}
        </span>
        {game.rating != null && (
          <p className="text-sm text-base-content/70">Note : {game.rating}/10</p>
        )}
      </div>
    </div>
  )
}

export default GameCard
