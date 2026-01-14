import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import TourTableBody from '../../../../../components/tour-table/TourTableBody'
import { TourTableHeader } from '../../../../../components/tour-table/TourTableHeader'
import { TourTableToolbar } from '../../../../../components/tour-table/TourTableToolbar'
import { TourTableFooter } from '../../../../../components/tour-table/TourTableFooter'
import { useTourColumns } from '../../../../../components/tour-table/hooks'
import { useTravellerTours } from '../-hooks'
import type {
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Table } from '@/components/ui/table'

export function TravellerTourTable() {
  const navigate = useNavigate()
  const { tours } = useTravellerTours()
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

  const handleShow = (tour: TourDto) => navigate({ to: `/guide/tours/${tour.id}` })



  const table = useReactTable({
    data: tours,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnVisibility,
      // rowSelection,
    }
  })

  const extraColumns = 2 // selection + actions

  return (
      <div className="mt-4 rounded-md border bg-background">
        <TourTableToolbar 
          toggleableColumns={table.getAllColumns().filter((column) => column.getCanHide())} 
          columnVisibility={table.getState().columnVisibility}  
          />

        <Table>
          <TourTableHeader headerGroups={table.getHeaderGroups()} />
          <TourTableBody
            rowModel={table.getRowModel()} 
            columns={table.getVisibleFlatColumns()}
            onShowRow={handleShow}
          />
          <TourTableFooter table={table} extraColumns={extraColumns} />
        </Table>
      </div>
  )
}
