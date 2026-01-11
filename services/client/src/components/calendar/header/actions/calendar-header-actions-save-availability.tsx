import { Save } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Api from '@/lib/api'
import { profileQueries, profileQueryKeys } from '@/lib/query'
import { useCalendarContext } from '../../calendar-context'
import { Button } from '@/components/ui/button'

export default function CalendarHeaderActionsSaveAvailability() {
  const { editAvailabilityMode, hasAvailabilityChanges, availabilityChanges = [], setAvailabilityChanges, setEditAvailabilityMode } = useCalendarContext()
  const queryClient = useQueryClient()
  const api = new Api()
  
  // Get guide ID from profile
  const { data: profile } = useQuery(profileQueries.me())
  const guideId = profile?.guide?.id
  
  // All hooks must be called before any conditional returns
  const saveAvailabilityMutation = useMutation({
    mutationFn: async (availabilities: Array<{ start_date: Date; end_date: Date }>) => {
      // Convert Date objects to date-only format (no time) and send all in one batch request
      const formattedAvailabilities = availabilities.map((availability) => {
        const startDate = new Date(availability.start_date)
        const endDate = new Date(availability.end_date)
        
        // Reset time to midnight (UTC) to ensure we're only sending dates
        startDate.setUTCHours(0, 0, 0, 0)
        endDate.setUTCHours(0, 0, 0, 0)
        
        return {
          start_date: startDate,
          end_date: endDate,
        }
      })
      
      // Send all availabilities in a single request
      return api.profile.createGuideAvailability(formattedAvailabilities)
    },
    onSuccess: () => {
      // Invalidate availabilities query to refetch after save
      if (guideId) {
        queryClient.invalidateQueries({ 
          queryKey: profileQueryKeys.guideAvailabilities(guideId) 
        })
      }
      
      // Show success message
      toast.success(
        `Successfully saved ${availabilityChanges.length} availability period${availabilityChanges.length > 1 ? 's' : ''}`
      )
      
      // Clear changes and exit edit mode
      if (setAvailabilityChanges) {
        setAvailabilityChanges([])
      }
      if (setEditAvailabilityMode) {
        setEditAvailabilityMode(false)
      }
    },
    onError: (error: Error) => {
      console.error('Error saving availability:', error)
      toast.error(error.message || 'Failed to save availability')
    },
  })
  
  const handleSave = () => {
    if (!availabilityChanges.length) {
      return
    }
    
    saveAvailabilityMutation.mutate(availabilityChanges)
  }
  
  // Only show save button when in edit mode AND there are changes
  if (!editAvailabilityMode || !hasAvailabilityChanges) {
    return null
  }
  
  return (
    <Button
      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      onClick={handleSave}
      disabled={saveAvailabilityMutation.isPending}
    >
      <Save className="h-4 w-4" />
      {saveAvailabilityMutation.isPending ? 'Saving...' : 'Save Availability'}
    </Button>
  )
}
