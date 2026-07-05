import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'
import { searchGames } from '../api/rawg'

vi.mock('../api/rawg', () => ({
  searchGames: vi.fn(),
}))

const mockedSearchGames = vi.mocked(searchGames)

beforeEach(() => {
  mockedSearchGames.mockReset()
  mockedSearchGames.mockResolvedValue([
    {
      id: 1,
      title: 'Zelda',
      cover: null,
      released: '2020-01-01',
      genres: [],
      platforms: [],
      metacritic: null,
    },
  ])
})

describe('Header', () => {
  it('closes the search dropdown when Escape is pressed (US-1)', async () => {
    render(<Header onSelectGame={vi.fn()} />)
    const input = screen.getByPlaceholderText('Rechercher un jeu...')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'ze' } })

    expect(await screen.findByText('Zelda')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.queryByText('Zelda')).not.toBeInTheDocument()
  })
})
