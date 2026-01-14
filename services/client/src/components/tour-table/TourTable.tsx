import * as React from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import TourTableBody from './TourTableBody'
import { TourTableHeader } from './TourTableHeader'
import { TourTableToolbar } from './TourTableToolbar'
import { TourTableFooter } from './TourTableFooter'
import { useTourColumns } from './columns'
import type {
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Table } from '@/components/ui/table'



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
        <TourTableFooter table={table} extraColumns={extraColumns} />
      </Table>
    </div>
  )
}
