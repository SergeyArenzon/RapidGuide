import Link from "next/link"
import { AlertCircle, Home, RotateCcw, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  statusCode?: number
  title?: string
  description?: string
  showHomeButton?: boolean
  Icon?: LucideIcon
  retryAction?: () => void
}

export function Error({
  statusCode,
  title = "An error occurred",
  description = "Something went wrong. Please try again later.",
  Icon = AlertCircle,
  showHomeButton = true,
  retryAction,
}: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>

      {statusCode && <div className="text-sm font-medium text-muted-foreground mb-2">Error {statusCode}</div>}

      <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">{description}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        {retryAction && (
          <Button onClick={retryAction} variant="default">
            Try again
            <RotateCcw className="mr-2 h-4 w-4" />
          </Button>
        )}

        {showHomeButton && (
          <Button asChild variant={retryAction ? "outline" : "default"}>
            <Link href="/">
              Go back home
              <Home className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

