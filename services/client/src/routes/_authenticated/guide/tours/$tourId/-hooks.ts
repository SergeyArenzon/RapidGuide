import { useSuspenseQuery } from '@tanstack/react-query'
import Api from '@/lib/api'

export function useTourDetail(tourId: string) {
  const api = new Api()

  const { data: tour } = useSuspenseQuery({
    queryKey: ['tour', tourId],
    queryFn: () => api.tour.getTour(tourId),
    retry: false,
  })

  const { data: countries = [] } = useSuspenseQuery({
    queryKey: ['countries'],
    queryFn: () => api.profile.getCountries(),
    retry: false,
  })

  const { data: cities = [] } = useSuspenseQuery({
    queryKey: ['cities'],
    queryFn: () => api.profile.getCities(),
    retry: false,
  })

  const country = countries.find(c => c.code === tour.country_code)
  const city = cities.find(c => c.id === tour.city_id)

  return {
    tour,
    country,
    city,
  }
}

