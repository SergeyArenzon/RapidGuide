import { Outlet, createFileRoute } from '@tanstack/react-router'
import Api from '@/lib/api'
import { refreshSession } from '@/hooks/use-auth/helpers'
import { useJwtTokenStore } from '@/store/useJwtToken'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId')({
  loader: async ({ params, context }) => {    
    const { tourId } = params
    const queryKey = ['tour', tourId]
    
    // Check if data already exists in cache
    const cachedTour = context.queryClient.getQueryData(queryKey)
    if (cachedTour) {
      return { tour: cachedTour }
    }
    
    // Only fetch if not in cache
    const api = new Api()
    const tour = await context.queryClient.ensureQueryData({
      queryKey,
      queryFn: () => {
        console.log('fetching tour', tourId);
        return api.tour.getTour(tourId)
      },
    })
    return { tour }
  },
  staticData: {
    label: 'Tour Details',
    description: 'View tour details.',
    showBreadcrumb: true,
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

