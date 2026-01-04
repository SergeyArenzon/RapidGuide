import { useSuspenseQuery } from '@tanstack/react-query'
import { profileQueries, tourQueries } from '@/lib/query'

export function useGuideCard(guideId: string) {
  const { data: guide } = useSuspenseQuery(profileQueries.guideById(guideId))
  const { data: languages = [] } = useSuspenseQuery(profileQueries.languages())
  const { data: subcategories = [] } = useSuspenseQuery(tourQueries.subcategories())
  const { data: countries = [] } = useSuspenseQuery(profileQueries.countries())
  const { data: cities = [] } = useSuspenseQuery(profileQueries.cities())

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

