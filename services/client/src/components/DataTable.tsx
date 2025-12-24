import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Settings2,
} from 'lucide-react'
import type {
  ColumnDef,
  ColumnFiltersState,
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

type AnyRow<TData> = Row<TData>

export interface DataTableProps<TData> {
  columns: Array<ColumnDef<TData, unknown>>
  data: Array<TData>
  /** Message to display when there are no rows */
  emptyMessage?: string
  /** Optional custom row id resolver */
  getRowId?: (originalRow: TData, index: number, parent?: AnyRow<TData>) => string
  /** Optional column id to use for the built-in text filter (e.g. "name") */
  filterColumnId?: string
  /** Optional placeholder for the filter input */
  filterPlaceholder?: string
  /** Optional default row action handlers */
  onShowRow?: (row: TData) => void
  onEditRow?: (row: TData) => void
  onDeleteRow?: (row: TData) => void
}

export function DataTable<TData>({
  columns,
  data,
  emptyMessage = 'No data found.',
  getRowId,
  filterColumnId,
  filterPlaceholder = 'Filter...',
  onShowRow,
  onEditRow,
  onDeleteRow,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const rows = table.getRowModel().rows
  const filteredRows = table.getFilteredRowModel().rows
  const extraColumns = 2 // selection + actions

  return (
    <div className="mt-4 rounded-md border bg-background">
      <div className="flex items-center gap-2 p-3">
        {filterColumnId && (
          <Input
            placeholder={filterPlaceholder}
            value={String(table.getColumn(filterColumnId)?.getFilterValue() ?? '')}
            onChange={(event) =>
              table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
            }
            className="h-8 max-w-xs"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto inline-flex h-8 items-center gap-1"
            >
              <Settings2 className="h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead>
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                  }
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                />
              </TableHead>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
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
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onEditRow?.(row.original)
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        onDeleteRow?.(row.original)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + extraColumns} className="h-24 text-center">
                {emptyMessage}
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
                  {filteredRows.length} row(s) selected
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
