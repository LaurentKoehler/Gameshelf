import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from './useToast'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useToast', () => {
  it('starts with no message', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.message).toBeNull()
  })

  it('shows a message when told to', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Jeu ajouté')
    })

    expect(result.current.message).toBe('Jeu ajouté')
  })

  it('clears the message after a few seconds', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Jeu ajouté')
    })
    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(result.current.message).toBeNull()
  })
})
