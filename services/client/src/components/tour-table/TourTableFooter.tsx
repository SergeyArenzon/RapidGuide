import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { Table as TableType } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import {
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'

interface TourTableFooterProps {
  table: TableType<TourDto>
  extraColumns?: number
}

export function TourTableFooter({ table, extraColumns = 2 }: TourTableFooterProps) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell
          colSpan={table.getVisibleLeafColumns().length + extraColumns}
          className="px-3 py-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-muted-foreground text-xs md:text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getRowModel().rows.length} row(s) selected
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                Page size: {table.getState().pagination.pageSize}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden h-8 w-8 md:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground md:text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount() || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden h-8 w-8 md:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}

