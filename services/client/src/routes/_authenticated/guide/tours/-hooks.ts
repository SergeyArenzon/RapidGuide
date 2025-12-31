import { useSuspenseQuery } from '@tanstack/react-query'
import Api from '@/lib/api'
import type { TourDto } from '@rapid-guide-io/contracts'

export function useTours() {
  const api = new Api()

  const { data: tours = [] as Array<TourDto> } = useSuspenseQuery({
    queryKey: ['tours'],
    queryFn: () => api.tour.getTours(),
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

  return {
    tours,
    countries,
    cities,
  }
}

