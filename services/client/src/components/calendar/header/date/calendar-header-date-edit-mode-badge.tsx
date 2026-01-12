import { useCalendarContext } from '../../calendar-context'
import { Edit } from 'lucide-react'

export default function CalendarHeaderDateEditModeBadge() {
  const { editAvailabilityMode } = useCalendarContext()
  
  if (!editAvailabilityMode) return null
  
  return (
    <div className="whitespace-nowrap rounded-sm border border-primary bg-primary/10 px-2 py-1 text-xs font-medium text-primary flex items-center gap-1.5">
      <Edit className="h-3 w-3" />
      Editing availability
    </div>
  )
}

