import { useSuspenseQuery } from '@tanstack/react-query'
import type { TourDto } from '@rapid-guide-io/contracts'
import { profileQueries, tourQueries } from '@/lib/query'

export function useGuideTours({ guideId }: { guideId: string }) {
  const { data: tours = [] as Array<TourDto> } = useSuspenseQuery(tourQueries.byGuide(guideId)
)
  const { data: countries = [] } = useSuspenseQuery(profileQueries.countries())
  const { data: cities = [] } = useSuspenseQuery(profileQueries.cities())

  return {
    tours,
    countries,
    cities,
  }
}

