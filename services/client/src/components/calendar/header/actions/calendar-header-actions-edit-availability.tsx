import { Pen } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'
import { Button } from '@/components/ui/button'

export default function CalendarHeaderActionsEditAvailability() {
  const { setEditAvailabilityMode, setMode } = useCalendarContext()
  
  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      onClick={() => {
        setMode('week')
        setEditAvailabilityMode?.(true)
      }}
    >
      <Pen />
      Edit Availability
    </Button>
  )
}
