import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameModal from './GameModal'
import type { SearchResult } from '../types'

const sampleGame: SearchResult = {
  id: 1,
  title: 'Elden Ring',
  cover: null,
  released: '2022-02-25',
  genres: [],
  platforms: [],
  metacritic: null,
}

describe('GameModal', () => {
  it('defaults the status picker to "backlog" (US-2)', () => {
    render(
      <GameModal game={sampleGame} alreadyInLibrary={false} onClose={vi.fn()} onAdd={vi.fn()} />,
    )

    expect(screen.getByLabelText('Statut')).toHaveValue('backlog')
  })
})
