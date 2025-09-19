interface LoadingStateProps {
  message?: string
}

export function LoadingState({ 
  message = "Loading..."
}: LoadingStateProps) {
  return (
    <div className="text-center loading-transition">
      <div className="w-6 h-6 mx-auto mb-3 animate-spin">
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
