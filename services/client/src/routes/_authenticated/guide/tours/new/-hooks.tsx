import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { CreateTourDto } from '@rapid-guide-io/contracts'
import Api from '@/lib/api'

export function useTourFormData() {
  const api = new Api()

  const { data: categories } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: () => api.tour.getCategories(),
    retry: false,
  })

  const { data: subcategories } = useSuspenseQuery({
    queryKey: ['subcategories'],
    queryFn: () => api.tour.getSubCategories(),
    retry: false,
  })

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

  return { subcategoryOptions }
}

export function useCreateTourMutation() {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tour: CreateTourDto) => api.tour.createTour(tour),
    onSuccess: () => {
      toast.success('Tour created successfully!')
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      navigate({ to: '/guide/tours' })
    },
    onError: (error: Error) => {
      console.error('Error creating tour:', error)
      toast.error(error.message || 'Failed to create tour')
    },
  })
}

