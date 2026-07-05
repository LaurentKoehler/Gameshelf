import { describe, it, expect } from 'vitest'
import { formatDate, getAvailableStatuses, hasFinishedOnceMention, shouldShowCompletionDate } from './types'
import type { Game } from './types'

describe('getAvailableStatuses', () => {
  it('offers "replaying" when the current status is "finished"', () => {
    const values = getAvailableStatuses('finished').map((option) => option.value)
    expect(values).toContain('replaying')
  })

  it('keeps offering "replaying" when it is already the current status', () => {
    const values = getAvailableStatuses('replaying').map((option) => option.value)
    expect(values).toContain('replaying')
  })

  it.each(['wishlist', 'backlog', 'playing', 'dropped'] as const)(
    'hides "replaying" when the current status is "%s"',
    (status) => {
      const values = getAvailableStatuses(status).map((option) => option.value)
      expect(values).not.toContain('replaying')
    },
  )
})

describe('hasFinishedOnceMention', () => {
  const base: Pick<Game, 'status' | 'finishedAt'> = { status: 'dropped', finishedAt: '2026-01-01' }

  it('is true when finishedAt is set and the game is no longer finished or replaying', () => {
    expect(hasFinishedOnceMention(base)).toBe(true)
  })

  it('is false when finishedAt is not set', () => {
    expect(hasFinishedOnceMention({ ...base, finishedAt: null })).toBe(false)
  })

  it('is false while the game is currently "finished"', () => {
    expect(hasFinishedOnceMention({ ...base, status: 'finished' })).toBe(false)
  })

  it('is false while the game is currently "replaying"', () => {
    expect(hasFinishedOnceMention({ ...base, status: 'replaying' })).toBe(false)
  })
})

describe('shouldShowCompletionDate', () => {
  const base: Pick<Game, 'status' | 'finishedAt'> = { status: 'finished', finishedAt: '2026-01-01' }

  it('is true while the game is currently "finished"', () => {
    expect(shouldShowCompletionDate(base)).toBe(true)
  })

  it('is true while the game is currently "replaying"', () => {
    expect(shouldShowCompletionDate({ ...base, status: 'replaying' })).toBe(true)
  })

  it('is false once the game has moved to another status', () => {
    expect(shouldShowCompletionDate({ ...base, status: 'dropped' })).toBe(false)
  })

  it('is false when finishedAt is not set', () => {
    expect(shouldShowCompletionDate({ ...base, finishedAt: null })).toBe(false)
  })
})

describe('formatDate', () => {
  it('formats an ISO date string as DD/MM/YYYY', () => {
    expect(formatDate('2026-03-15')).toBe('15/03/2026')
  })

  it('is not shifted by the local timezone (forced to UTC)', () => {
    expect(formatDate('2026-01-01')).toBe('01/01/2026')
  })
})
