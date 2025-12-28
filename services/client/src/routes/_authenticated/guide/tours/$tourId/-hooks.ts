import { useQuery } from '@tanstack/react-query'
import Api from '@/lib/api'

export function useTourDetail(tourId: string) {
  const api = new Api()

  const tourQuery = useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => api.tour.getTour(tourId),
    retry: false,
  })

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.profile.getCountries(),
    retry: false,
  })

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => api.profile.getCities(),
    retry: false,
  })

  const country = countries.find(c => c.code === tourQuery.data?.country_code)
  const city = cities.find(c => c.id === tourQuery.data?.city_id)

  return {
    tour: tourQuery.data,
    isLoading: tourQuery.isLoading,
    isError: tourQuery.isError,
    refetch: tourQuery.refetch,
    country,
    city,
  }
}

