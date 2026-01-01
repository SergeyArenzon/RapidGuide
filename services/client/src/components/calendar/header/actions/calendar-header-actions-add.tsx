import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'
import { Button } from '@/components/ui/button'

export default function CalendarHeaderActionsAdd() {
  const { setNewEventDialogOpen } = useCalendarContext()
  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      onClick={() => setNewEventDialogOpen(true)}
    >
      <Plus />
      Add Event
    </Button>
  )
}
