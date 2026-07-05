import { useEffect, useState } from 'react'

const TOAST_DURATION = 2500

// Shows a short-lived confirmation message, auto-dismissed after a few
// seconds. Used for the "game added" / "game deleted" confirmations (US-2, US-4).
export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (message == null) return
    const timeoutId = setTimeout(() => setMessage(null), TOAST_DURATION)
    return () => clearTimeout(timeoutId)
  }, [message])

  return { message, showToast: setMessage }
}
