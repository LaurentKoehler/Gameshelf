import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { computeCounters, computeFinishedPerMonth, computeGenreDistribution } from '../stats'
import type { Game } from '../types'

const GENRE_COLORS = [
  '#6366f1',
  '#22c55e',
  '#f97316',
  '#ec4899',
  '#06b6d4',
  '#eab308',
  '#8b5cf6',
  '#ef4444',
]

interface StatsPageProps {
  library: Game[]
}

function StatsPage({ library }: StatsPageProps) {
  if (library.length === 0) {
    return (
      <p className="text-center text-base-content/60">
        Les statistiques apparaîtront une fois que tu auras ajouté des jeux.
      </p>
    )
  }

  const counters = computeCounters(library)
  const monthly = computeFinishedPerMonth(library)
  const genres = computeGenreDistribution(library)

  return (
    <div className="flex flex-col gap-8">
      <div className="stats stats-vertical bg-base-200 shadow sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Jeux au total</div>
          <div className="stat-value">{counters.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Terminés cette année</div>
          <div className="stat-value">{counters.finishedThisYear}</div>
        </div>
        <div className="stat">
          <div className="stat-title">En cours</div>
          <div className="stat-value">{counters.currentlyPlaying}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Note moyenne</div>
          <div className="stat-value">
            {counters.averageRating != null ? counters.averageRating.toFixed(1) : '—'}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Jeux terminés par mois</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Terminés" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {genres.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Répartition par genre</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genres} dataKey="count" nameKey="genre" innerRadius={60} outerRadius={100}>
                {genres.map((entry, index) => (
                  <Cell key={entry.genre} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default StatsPage
