import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function TourDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-96 mt-2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

