import { Outlet, createFileRoute } from '@tanstack/react-router'
import { tourQueries } from '@/lib/query'

export const Route = createFileRoute('/_authenticated/guide/tours/$tourId')({
  loader: async ({ params, context }) => {    
    const { tourId } = params
    
    // Only fetch if not in cache
    const tour = await context.queryClient.ensureQueryData(
      tourQueries.detail(tourId, context.jwt)
    )
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

