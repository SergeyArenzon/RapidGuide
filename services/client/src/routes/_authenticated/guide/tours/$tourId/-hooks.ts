import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { profileQueries, tourQueries, tourQueryKeys } from '@/lib/query'
import Api from '@/lib/api'

export function useTourDetail(tourId: string) {
  const { data: tour } = useSuspenseQuery(tourQueries.detail(tourId))
  const { data: countries = [] } = useSuspenseQuery(profileQueries.countries())
  const { data: cities = [] } = useSuspenseQuery(profileQueries.cities())

  const country = countries.find(c => c.code === tour.country_code)
  const city = cities.find(c => c.id === tour.city_id)

  return {
    tour,
    country,
    city,
  }
}

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

