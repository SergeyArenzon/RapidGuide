import { Skeleton } from '@/components/ui/skeleton'

export function ReservationSkeleton() {
  return (
    <div className="grid grid-cols-[min-content_1fr] gap-4">
      {/* Calendar placeholder */}
      <div className="rounded-md border bg-background p-3 self-start [--cell-size:2rem] w-fit">
        <div className="flex flex-col gap-4">
          <div className="flex h-(--cell-size) items-center justify-between px-(--cell-size)">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-(--cell-size) w-(--cell-size) rounded-md" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-(--cell-size) w-(--cell-size) rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
