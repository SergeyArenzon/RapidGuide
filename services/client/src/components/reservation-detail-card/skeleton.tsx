import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ReservationDetailsCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Skeleton className="h-8 w-64" />
        </CardTitle>
        <CardDescription className="text-base">
          <Skeleton className="h-5 w-full max-w-md" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full max-w-[140px]" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Skeleton className="h-11 w-full rounded-md" />
      </CardFooter>
    </Card>
  )
}
