import { Skeleton } from '@/components/ui/skeleton'

interface FormSkeletonProps {
  fieldCount?: number
  showButtons?: boolean
}

export function FormSkeleton({ fieldCount = 6, showButtons = true }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {showButtons && (
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </div>
    </div>
  )
}

