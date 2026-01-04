import { GuideCardSkeleton } from '@/components/GuideCard'
import { TourCardSkeleton } from '@/components/TourCard'

export function TourDetailSkeleton() {
  return (
    <div className="space-y-6">
      <TourCardSkeleton />
      <GuideCardSkeleton />
    </div>
  )
}

