
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface TimeSlotCardProps {
  slot: TimeSlot
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof TimeSlot, value: string | number) => void
}

export function TimeSlotCard({ slot, onRemove, onUpdate }: TimeSlotCardProps) {
  return (
    <Card className="p-2 relative inline-flex items-center gap-2 min-w-0">
      <div className="flex items-center gap-1 text-xs">
        <input
          id={`start-${slot.id}`}
          type="time"
          value={slot.startTime}
          onChange={(e) => onUpdate(slot.id, "startTime", e.target.value)}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="text-muted-foreground">-</span>
        <input
          id={`end-${slot.id}`}
          type="time"
          value={slot.endTime}
          onChange={(e) => onUpdate(slot.id, "endTime", e.target.value)}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => onRemove(slot.id)}>
        <X className="h-3 w-3" />
      </Button>
    </Card>
  )
}
