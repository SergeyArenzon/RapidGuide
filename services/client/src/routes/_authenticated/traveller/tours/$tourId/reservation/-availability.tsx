import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


interface AvailabilityProps {
  id: string
  startTime: string
  endTime: string
  isActive?: boolean
  isReserved?: boolean
  onClick?: () => void
}

export function Availability({ id, startTime, endTime, isActive, isReserved, onClick }: AvailabilityProps) {
  return (
    <Button
      key={id}
      variant={isActive ? "default" : isReserved ? "secondary" : "outline"}
      className={cn(
        "h-auto py-3 flex flex-col gap-1",
        isActive && "bg-primary text-primary-foreground",
        isReserved && !isActive && "border-accent-foreground text-accent-foreground bg-accent"
      )}
      onClick={onClick}
      title={isReserved ? "This time slot already has reservations. Click to view and join." : undefined}
    >
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        <span>{startTime}-{endTime}</span>
        {isReserved && <span className="text-xs ">(Reserved)</span>}
      </div>
    </Button>
  )
}

