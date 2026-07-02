import { useEffect, useState } from 'react'

// Returns `value`, but only updates it after `delay` ms without changes.
// This avoids firing an API call on every single keystroke.
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}
