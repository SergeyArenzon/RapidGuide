import { Outlet, createFileRoute } from '@tanstack/react-router'
import Api from '@/lib/api'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId')({
  loader: async ({ params, context }) => {    
    const { tourId } = params
    const queryKey = ['tour', tourId]
    
    // Only fetch if not in cache
    const api = new Api(context.jwt!)
    const tour = await context.queryClient.ensureQueryData({
      queryKey,
      queryFn: () =>  api.tour.getTour(tourId)
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

