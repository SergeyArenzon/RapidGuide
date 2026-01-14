import * as React from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import TourTableBody from './TourTableBody'
import { TourTableHeader } from './TourTableHeader'
import { TourTableToolbar } from './TourTableToolbar'
import { useTourColumns } from './columns'
import type {
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'



export interface DataTableProps {
  data: Array<TourDto>
  /** Optional custom row id resolver */
  getRowId?: (originalRow: TourDto, index: number, parent?: Row<TourDto>) => string
  /** Optional default row action handlers */
  onShowRow?: (row: TourDto) => void
  onEditRow?: (row: TourDto) => void
  onDeleteRow?: (row: TourDto) => void
  /** Optional handler for creation button */
  onCreate?: () => void
}


export function TourTable({
  data,
  getRowId,
  onShowRow,
  onEditRow,
  onDeleteRow,
  onCreate
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    name: true,
    country_code: true,
    city_id: true,
    duration_minutes: true,
    price: true,
    subcategory_ids: true,
  })
  const columns = useTourColumns()


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnVisibility,
      // rowSelection,
    },
    meta: {
      onShowRow,
      onEditRow,
      onDeleteRow,
    },
  })

  const extraColumns = 2 // selection + actions


  
 
  return (
    <div className="mt-4 rounded-md border bg-background">
      <TourTableToolbar 
      toggleableColumns={table.getAllColumns().filter((column) => column.getCanHide())} 
      columnVisibility={table.getState().columnVisibility} 
      onCreate={onCreate} />

      <Table>
        <TourTableHeader headerGroups={table.getHeaderGroups()} />
        <TourTableBody table={table} rowModel={table.getRowModel()} columns={table.getVisibleFlatColumns()}/>

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
      </Table>
    </div>
  )
}
