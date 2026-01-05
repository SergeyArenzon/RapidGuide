import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function GuideCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

