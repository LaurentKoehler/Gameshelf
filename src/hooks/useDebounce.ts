import { useEffect, useState } from 'react'

// Returns `value`, but only updates it after `delay` ms without changes.
// This avoids firing an API call on every single keystroke.
// The <T> generic just means "works with any type, and returns that same type".
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}
