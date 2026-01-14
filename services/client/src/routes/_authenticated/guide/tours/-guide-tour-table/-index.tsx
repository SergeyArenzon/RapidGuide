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
import type {
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Table } from '@/components/ui/table'
import { AlertDialog } from '@/components/AlertDialog'
import { useDeleteTourMutation } from '@/components/TourCard/useDeleteTourMutation'
import { useGuideTours } from '@/routes/_authenticated/guide/tours/-hooks'



export function GuideTourTable({ guideId }: { guideId: string }) {
  const navigate = useNavigate()
  const { tours } = useGuideTours({ guideId })
  const deleteTourMutation = useDeleteTourMutation()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    name: true,
    country_code: true,
    city_id: true,
    duration_minutes: true,
    price: true,
    subcategory_ids: true,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [tourToDelete, setTourToDelete] = React.useState<TourDto | null>(null)
  const columns = useTourColumns()

  const handleShow = (tour: TourDto) => navigate({ to: `/guide/tours/${tour.id}` })
  const handleEdit = (tour: TourDto) => navigate({ to: `/guide/tours/${tour.id}/edit` })
  const handleDelete = (tour: TourDto) => {

    setTourToDelete(tour)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (tourToDelete) {
      deleteTourMutation.mutate(tourToDelete.id)
      setDeleteDialogOpen(false)
      setTourToDelete(null)
    }
  }

  const handleCreate = () => navigate({ to: '/guide/tours/new' })


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
    },
    meta: {
      onShowRow: handleShow,
      onEditRow: handleEdit,
      onDeleteRow: handleDelete,
    },
  })

  const extraColumns = 2 // selection + actions

  return (
    <>
      <div className="mt-4 rounded-md border bg-background">
        <TourTableToolbar 
          toggleableColumns={table.getAllColumns().filter((column) => column.getCanHide())} 
          columnVisibility={table.getState().columnVisibility} 
          onCreate={handleCreate} />

        <Table>
          <TourTableHeader headerGroups={table.getHeaderGroups()} />
          <TourTableBody
            rowModel={table.getRowModel()} 
            columns={table.getVisibleFlatColumns()}
            onShowRow={handleShow}
            onEditRow={handleEdit}
            onDeleteRow={handleDelete}
          />
          <TourTableFooter table={table} extraColumns={extraColumns} />
        </Table>
      </div>
      {tourToDelete && (
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Tour"
          description={`Are you sure you want to delete "${tourToDelete.name}"? This action cannot be undone.`}
          approveText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onApprove={handleDeleteConfirm}
          onCancel={() => {
            setDeleteDialogOpen(false)
            setTourToDelete(null)
          }}
        />
      )}
    </>
  )
}
