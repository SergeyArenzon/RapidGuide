import { Save } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCalendarContext } from '../../calendar-context'
import Api from '@/lib/api'
import { profileQueries, profileQueryKeys } from '@/lib/query'
import { Button } from '@/components/ui/button'

export default function CalendarHeaderActionsSaveAvailability() {
  const { editAvailabilityMode, hasAvailabilityChanges, availabilityChanges = [], setAvailabilityChanges, availabilityDeletions = [], setAvailabilityDeletions, setEditAvailabilityMode } = useCalendarContext()
  const queryClient = useQueryClient()
  const api = new Api()
  
  // Get guide ID from profile
  const { data: profile } = useQuery(profileQueries.me())
  const guideId = profile?.guide?.id
  
  // All hooks must be called before any conditional returns
  const saveAvailabilityMutation = useMutation({
    mutationFn: async ({ 
      availabilities, 
      deletions 
    }: { 
      availabilities: Array<{ start_date: Date; end_date: Date }>
      deletions: Array<string>
    }) => {
      // First, delete all marked availabilities
      const deletePromises = deletions.map(availabilityId => 
        api.profile.deleteGuideAvailability(availabilityId)
      )
      await Promise.all(deletePromises)

      // Then, create new availabilities if any
      if (availabilities.length > 0) {
        // @ts-expect-error - Type definition issue: PostGuideAvailabilitiesRequestDto should be an array but TypeScript infers it as a single object
        await api.profile.createGuideAvailability(availabilities)
      }

      return { created: availabilities.length, deleted: deletions.length }
    },
    onSuccess: (result) => {
      // Invalidate availabilities query to refetch after save
      if (guideId) {
        queryClient.invalidateQueries({ 
          queryKey: profileQueryKeys.guideAvailabilities() 
        })
      }
      
      // Show success message
      const messages = []
      if (result.created > 0) {
        messages.push(`added ${result.created} availability period${result.created > 1 ? 's' : ''}`)
      }
      if (result.deleted > 0) {
        messages.push(`deleted ${result.deleted} availability period${result.deleted > 1 ? 's' : ''}`)
      }
      if (messages.length > 0) {
        toast.success(`Successfully ${messages.join(' and ')}`)
      }
      
      // Clear changes and exit edit mode
      if (setAvailabilityChanges) {
        setAvailabilityChanges([])
      }
      if (setAvailabilityDeletions) {
        setAvailabilityDeletions([])
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
    if (!hasAvailabilityChanges) {
      return
    }
    
    saveAvailabilityMutation.mutate({ 
      availabilities: availabilityChanges, 
      deletions: availabilityDeletions 
    })
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
