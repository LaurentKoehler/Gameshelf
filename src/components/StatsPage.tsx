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
import {
  computeCounters,
  computeFinishedPerMonth,
  computeGenreDistribution,
  computeStatusDistribution,
} from '../stats'
import { getStatusChartColor } from '../types'
import type { Game } from '../types'

// Genre colors are only ever used in the donut (US-6b: "one color, one
// meaning") — they never appear on a status bar or the monthly chart.
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

// A neutral gray used by no genre slice and no status badge (US-6b), so the
// monthly chart doesn't accidentally borrow a meaning from another chart.
const NEUTRAL_CHART_COLOR = '#94a3b8'

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
  const statuses = computeStatusDistribution(library)

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
            <Bar dataKey="count" name="Terminés" fill={NEUTRAL_CHART_COLOR} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {statuses.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Répartition par statut</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statuses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Jeux">
                {statuses.map((entry) => (
                  <Cell key={entry.status} fill={getStatusChartColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {genres.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Répartition par genre</h2>
          <p className="mb-2 text-xs text-base-content/60">
            Un jeu avec plusieurs genres est compté une fois pour chacun d'eux.
          </p>
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
