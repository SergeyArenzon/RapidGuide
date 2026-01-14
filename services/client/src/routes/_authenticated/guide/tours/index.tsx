import { Suspense, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { ToursListSkeleton } from './-skeleton'
import { useTours } from './-hooks'
import type { TourDto } from '@rapid-guide-io/contracts'
import { useDeleteTourMutation } from '@/components/TourCard/useDeleteTourMutation'
import { FirstTimeCreation } from '@/components/FirstTimeCreation'
import { TourTable } from '@/components/tour-table/TourTable'
import { AlertDialog } from '@/components/AlertDialog'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
  staticData: {
    label: 'Tours',
    description: 'View all your tours and manage them.',
    showBreadcrumb: false,
  },
})

function RouteComponent() {
  return (
    <Suspense fallback={<ToursListSkeleton />}>
      <ToursListContent />
    </Suspense>
  )
}

function ToursListContent() {
  const navigate = useNavigate()
  const { guide } = Route.useRouteContext()
  
  const { tours } = useTours({ guideId: guide?.id ?? '' })
  const deleteTourMutation = useDeleteTourMutation()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tourToDelete, setTourToDelete] = useState<TourDto | null>(null)

  const isFirstTour = tours.length === 0

  const handleShow = (tour: TourDto) => {
    navigate({ to: `/guide/tours/${tour.id}` })
  }

  const handleEdit = (tour: TourDto) => {
    navigate({ to: `/guide/tours/${tour.id}/edit` })
  }

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


  return (
    <div>
      {isFirstTour ? (
        <FirstTimeCreation
          title="Create Your First Tour"
          description="Get started by creating your first tour. Share your expertise and help travelers discover amazing experiences."
          icon={MapPin}
          buttonText="Create Your First Tour"
          buttonLink="/guide/tours/new"
        />
      ) : (
        <>
          <TourTable
            data={tours}
            onCreate={() => navigate({ to: '/guide/tours/new' })}
            onShowRow={handleShow}
            onEditRow={handleEdit}
            onDeleteRow={handleDelete}
          />
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
      )}
    </div>
  )
}
