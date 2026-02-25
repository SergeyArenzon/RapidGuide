import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueries, tourQueries } from '@/lib/query'

export function useGuideCard(guideId: string) {
  const { data: guide } = useSuspenseQuery(userQueries.guideById(guideId))
  const { data: languages = [] } = useSuspenseQuery(userQueries.languages())
  const { data: subcategories = [] } = useSuspenseQuery(tourQueries.subcategories())
  const { data: countries = [] } = useSuspenseQuery(userQueries.countries())
  const { data: cities = [] } = useSuspenseQuery(userQueries.cities())

  const country = countries.find(c => c.code === guide.country_code)
  const city = cities.find(c => c.id === guide.city_id)

  return {
    guide,
    languages,
    subcategories,
    country,
    city,
  }
}

