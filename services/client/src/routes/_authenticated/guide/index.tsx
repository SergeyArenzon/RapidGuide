import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/guide/')({
  component: GuideDashboard,
  staticData: {
    description: 'Manage your tours, bookings, and guide profile.',
    label: 'Guide Dashboard',
  },
})

function GuideDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome to Guide Mode</h2>
        <p className="text-muted-foreground mt-2">
          Manage your tours, bookings, and guide profile.
        </p>
      </div>
      {/* Add guide-specific dashboard content here */}
    </div>
  )
}
