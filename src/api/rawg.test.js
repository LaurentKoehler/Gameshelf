import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchGames } from './rawg'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchGames', () => {
  it('throws when the RAWG API is unreachable (US-1)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    await expect(searchGames('zelda')).rejects.toThrow('RAWG API error: 500')
  })

  it('returns an empty array when no game matches (US-1)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      }),
    )

    const results = await searchGames('azertyuiop')

    expect(results).toEqual([])
  })
})
