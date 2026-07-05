interface ToastProps {
  message: string | null
}

// A brief, auto-dismissed confirmation (see useToast), announced to screen
// readers via aria-live rather than requiring focus.
function Toast({ message }: ToastProps) {
  if (message == null) return null

  return (
    <div className="toast toast-end toast-bottom z-50" role="status" aria-live="polite">
      <div className="alert alert-success">
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast
