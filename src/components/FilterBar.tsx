import { STATUSES } from '../types'
import type { SortOption, StatusFilter } from '../filters'

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  ...STATUSES,
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'addedAt', label: "Date d'ajout" },
  { value: 'title', label: 'Alphabétique' },
  { value: 'rating', label: 'Note' },
  { value: 'metacritic', label: 'Metacritic' },
]

interface FilterBarProps {
  statusFilter: StatusFilter
  onStatusFilterChange: (status: StatusFilter) => void
  counts: Record<StatusFilter, number>
  genres: string[]
  genreFilter: string | null
  onGenreFilterChange: (genre: string | null) => void
  sortBy: SortOption
  onSortByChange: (sortBy: SortOption) => void
}

function FilterBar({
  statusFilter,
  onStatusFilterChange,
  counts,
  genres,
  genreFilter,
  onGenreFilterChange,
  sortBy,
  onSortByChange,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`btn btn-sm ${statusFilter === option.value ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onStatusFilterChange(option.value)}
          >
            {option.label} ({counts[option.value]})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <select
          aria-label="Genre"
          className="select select-bordered select-sm"
          value={genreFilter ?? ''}
          onChange={(event) => onGenreFilterChange(event.target.value || null)}
        >
          <option value="">Tous les genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          aria-label="Trier par"
          className="select select-bordered select-sm"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
