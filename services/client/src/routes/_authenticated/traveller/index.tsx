import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/traveller/')({
  component: TravellerDashboard,
  staticData: {
    label: 'Dashboard',
    showBreadcrumb: true,
  },
})

function TravellerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome to Traveller Mode</h2>
        <p className="text-muted-foreground mt-2">
          Discover tours, manage bookings, and explore destinations.
        </p>
      </div>
      {/* Add traveller-specific dashboard content here */}
    </div>
  )
}
