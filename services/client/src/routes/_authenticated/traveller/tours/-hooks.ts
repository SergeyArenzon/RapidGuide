import { useSuspenseQuery } from '@tanstack/react-query'
import type { TourDto } from '@rapid-guide-io/contracts'
import { profileQueries, tourQueries } from '@/lib/query'

export function useTravellerTours(cityId?: number) {
  const { data: tours = [] as Array<TourDto> } = useSuspenseQuery(
    cityId ? tourQueries.byCity(cityId) : tourQueries.all()
  )
  const { data: countries = [] } = useSuspenseQuery(profileQueries.countries())
  const { data: cities = [] } = useSuspenseQuery(profileQueries.cities())

  return {
    tours,
    countries,
    cities,
  }
}

