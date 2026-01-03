import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ToursListSkeleton() {
  return (
    <div className="mt-4 rounded-md border bg-background overflow-hidden">
      <div className="flex items-center gap-2 p-3 flex-wrap">
        <Skeleton className="h-8 w-full max-w-xs" />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="min-w-[100px]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="min-w-[100px]">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[80px]" />
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

