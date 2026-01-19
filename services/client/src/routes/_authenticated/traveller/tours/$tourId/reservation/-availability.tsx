import { Clock } from 'lucide-react'
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
        "h-auto py-3 flex flex-col gap-1",
        isActive && "bg-primary text-primary-foreground"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        <span>{startTime}-{endTime}</span>
      </div>
    </Button>
  )
}

