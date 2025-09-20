import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="text-center">
      <AlertTriangle className="w-6 h-6 mx-auto mb-3 text-destructive-foreground" />
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" size="compact" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  )
}
