import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import Api from '@/lib/api'
import { tourQueryKeys } from '@/lib/query'

export function useDeleteTourMutation() {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tourId: string) => api.tour.deleteTour(tourId),
    onSuccess: () => {
      toast.success('Tour deleted successfully!')
      queryClient.invalidateQueries({ queryKey: tourQueryKeys.all() })
      navigate({ to: '/guide/tours' })
    },
    onError: (error: Error) => {
      console.error('Error deleting tour:', error)
      toast.error(error.message || 'Failed to delete tour')
    },
  })
}

