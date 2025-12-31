import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { CreateTourDto } from '@rapid-guide-io/contracts'
import Api from '@/lib/api'
import { tourQueries, profileQueries, tourQueryKeys } from '@/lib/query'

export function useTourFormData() {
  const { data: categories } = useSuspenseQuery(tourQueries.categories())
  const { data: subcategories } = useSuspenseQuery(tourQueries.subcategories())
  const { data: countries } = useSuspenseQuery(profileQueries.countries())
  const { data: cities } = useSuspenseQuery(profileQueries.cities())

  // Prepare subcategory options grouped by category
  const subcategoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    subcategories: subcategories
      .filter((sub) => sub.category_id === category.id)
      .map((sub) => ({
        value: sub.id,
        label: sub.name,
      })),
  }))

  return { subcategoryOptions, countries, cities }
}

export function useTourDetail(tourId: string) {
  const tourQuery = useQuery(tourQueries.detail(tourId))

  return {
    tour: tourQuery.data,
    isLoading: tourQuery.isLoading,
    isError: tourQuery.isError,
    refetch: tourQuery.refetch,
  }
}

export function useUpdateTourMutation(tourId: string) {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tour: CreateTourDto) => api.tour.updateTour(tourId, tour),
    onSuccess: () => {
      toast.success('Tour updated successfully!')
      queryClient.invalidateQueries({ queryKey: tourQueryKeys.all() })
      queryClient.invalidateQueries({ queryKey: tourQueryKeys.detail(tourId) })
      navigate({ to: `/guide/tours/${tourId}` })
    },
    onError: (error: Error) => {
      console.error('Error updating tour:', error)
      toast.error(error.message || 'Failed to update tour')
    },
  })
}

