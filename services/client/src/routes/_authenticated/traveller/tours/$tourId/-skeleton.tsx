import { GuideCardSkeleton } from '@/components/GuideCard'
import { TourCardSkeleton } from '@/components/TourCard'
import { Skeleton } from '@/components/ui/skeleton'

export function TourDetailSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="row-span-2 row-start-1">
        <TourCardSkeleton />
      </div>
      <div className="col-start-2 row-start-1 h-full">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="col-start-2 row-start-2">
        <GuideCardSkeleton />
      </div>
    </div>
  )
}

