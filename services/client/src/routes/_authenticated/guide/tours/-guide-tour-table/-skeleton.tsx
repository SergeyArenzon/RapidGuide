import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function GuideTourTableSkeleton() {
  return (
    <div className="mt-4 rounded-md border bg-background overflow-hidden">
      <div className="flex items-center gap-2 p-3 flex-wrap">
        <Skeleton className="h-8 w-full max-w-xs" />
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="min-w-[120px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="min-w-[80px]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="min-w-[80px]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="min-w-[80px]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="min-w-[80px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </TableHead>
              <TableHead className="text-right w-16">
                <Skeleton className="h-4 w-4 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="px-3 py-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20 hidden md:block" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-8 w-8 hidden md:block" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8 hidden md:block" />
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

