import { Save } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCalendarContext } from '../../calendar-context'
import Api from '@/lib/api'
import { profileQueries, profileQueryKeys } from '@/lib/query'
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

      // Send all availabilities in a single request, preserving the time information
      // @ts-expect-error - Type definition issue: PostGuideAvailabilitiesRequestDto should be an array but TypeScript infers it as a single object
      return api.profile.createGuideAvailability(availabilities)
    },
    onSuccess: () => {
      // Invalidate availabilities query to refetch after save
      if (guideId) {
        queryClient.invalidateQueries({ 
          queryKey: profileQueryKeys.guideAvailabilities() 
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
