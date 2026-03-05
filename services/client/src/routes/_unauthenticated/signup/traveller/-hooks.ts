import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { CreateTravellerDto } from '@rapid-guide-io/contracts'
import Api from '@/lib/api'
import { userQueries, tourQueries } from '@/lib/query'
import { useRoleStore } from '@/store/useRole'

export function useTravellerFormData() {
  const { data: languages } = useSuspenseQuery(userQueries.languages())
  const { data: countries } = useSuspenseQuery(userQueries.countries())
  const { data: cities } = useSuspenseQuery(userQueries.cities())
  const { data: categories } = useSuspenseQuery(tourQueries.categories())
  const { data: subCategories } = useSuspenseQuery(tourQueries.subCategories())

  return {
    languages,
    countries,
    cities,
    categories,
    subCategories,
  }
}

export function useCreateTravellerMutation() {
  const navigate = useNavigate()
  const api = new Api()
  const { setRole } = useRoleStore(state => state)

  return useMutation({
    mutationFn: (traveller: CreateTravellerDto) => api.user.createTraveller(traveller),
    onSuccess: () => {
      setRole('traveller')
      toast.success('Your traveller profile has been created successfully.')
      navigate({ to: '/traveller' })
    },
    onError: (error: Error) => {
      console.error('Failed to create traveller:', error)
      toast.error(error.message || 'Failed to create traveller profile')
    },
  })
}

