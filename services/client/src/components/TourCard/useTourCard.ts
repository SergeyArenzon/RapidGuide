import { useSuspenseQuery } from '@tanstack/react-query'
import { profileQueries, tourQueries } from '@/lib/query'

export function useTourCard(tourId: string) {
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

