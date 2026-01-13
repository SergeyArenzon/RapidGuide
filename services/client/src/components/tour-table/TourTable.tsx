import * as React from 'react'
import {
  flexRender,
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
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import type {
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import type { TourDto } from '@rapid-guide-io/contracts'
import { TourTableToolbar } from './TourTableToolbar'
import { TourTableHeader } from './TourTableHeader'
import { useTourColumns } from './columns'



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
  /** Optional name to display in the create button (e.g. "Tour", "User") */
  name?: string
}


export function TourTable({
  data,
  getRowId,
  onShowRow,
  onEditRow,
  onDeleteRow,
  onCreate,
  name,
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
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const handleToggleColumn = (columnId: string, visible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: visible,
    }))
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  
  const rows = table.getRowModel().rows
  const extraColumns = 2 // selection + actions
  
  // Filter columns that can be toggled (have accessorKey and can be hidden)
  const toggleableColumns = table.getAllColumns().filter(
    (column) => column.getCanHide() 
  )
  
  return (
    <div className="mt-4 rounded-md border bg-background">
      <TourTableToolbar 
        columns={toggleableColumns}  
        onToggleColumn={handleToggleColumn}
        onCreate={onCreate} 
      />

      <Table>
        <TourTableHeader 
        headerGroups={table.getHeaderGroups()} 
        toggleAllPageRowsSelected={table.toggleAllPageRowsSelected}
        checked={table.getIsAllPageRowsSelected()}/>
        
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              </TableCell>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Open row actions</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        onShowRow?.(row.original)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onEditRow?.(row.original)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="danger"
                      onClick={() => {
                        onDeleteRow?.(row.original)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + extraColumns}
                className="h-24 text-center"
              >
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length + extraColumns}
              className="px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-muted-foreground text-xs md:text-sm">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {rows.length} row(s) selected
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
