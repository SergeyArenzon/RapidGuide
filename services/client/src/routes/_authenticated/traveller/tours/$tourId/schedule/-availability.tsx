import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AvailabilityProps {
  id: string
  startTime: string
  endTime: string
  isActive?: boolean
  onClick?: () => void
}

export function Availability({ id, startTime, endTime, isActive, onClick }: AvailabilityProps) {
  return (
    <Button
      key={id}
      variant={isActive ? "default" : "outline"}
      className={cn(
        "h-auto py-3 flex flex-col",
        isActive && "bg-primary text-primary-foreground"
      )}
      onClick={onClick}
    >
    {startTime}-{endTime}
    </Button>
  )
}

