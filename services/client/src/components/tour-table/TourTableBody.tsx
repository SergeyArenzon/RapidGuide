import { flexRender } from '@tanstack/react-table'
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { TableBody, TableCell, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import type { Column, RowModel, Table as TableType } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'

interface TableMeta {
  onShowRow?: (row: TourDto) => void
  onEditRow?: (row: TourDto) => void
  onDeleteRow?: (row: TourDto) => void
}

const TourTableBody = ({
    table,
    rowModel,
    columns,
}: {
    table: TableType<TourDto>
    rowModel: RowModel<TourDto>
    columns: Array<Column<TourDto>>
}) => {
    const extraColumns = 2 // selection + actions
    const meta = table.options.meta as TableMeta | undefined
    const onShowRow = meta?.onShowRow
    const onEditRow = meta?.onEditRow
    const onDeleteRow = meta?.onDeleteRow

  return (
    <TableBody>
      {rowModel.flatRows.map((row) => (
        <TableRow key={row.id}>
              {columns.map((column) => {
                const cell = row.getAllCells().find((c) => c.column.id === column.id)
                if (!cell) return null
                return (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
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
          {rowModel.rows.length === 0 && (
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
  )
}

export default TourTableBody

