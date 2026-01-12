import { X } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'
import { Button } from '@/components/ui/button'

export default function CalendarHeaderActionsCancelAvailability() {
  const { editAvailabilityMode, setEditAvailabilityMode, setAvailabilityChanges, setAvailabilityDeletions } = useCalendarContext()
  
  const handleCancel = () => {
    // Clear any unsaved changes
    if (setAvailabilityChanges) {
      setAvailabilityChanges([])
    }
    if (setAvailabilityDeletions) {
      setAvailabilityDeletions([])
    }
    // Exit edit mode
    if (setEditAvailabilityMode) {
      setEditAvailabilityMode(false)
    }
  }
  
  // Only show cancel button when in edit mode
  if (!editAvailabilityMode) {
    return null
  }
  
  return (
    <Button
      variant="outline"
      className="flex items-center gap-1"
      onClick={handleCancel}
    >
      <X className="h-4 w-4" />
      Cancel
    </Button>
  )
}

