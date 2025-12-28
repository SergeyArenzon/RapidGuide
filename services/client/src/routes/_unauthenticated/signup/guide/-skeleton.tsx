import { Skeleton } from '@/components/ui/skeleton'

export function GuideSignupSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-6 bg-white max-h-min py-10">
      {/* Title and Description */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Name field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Bio field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Categories field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Languages field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Country field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* City field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

