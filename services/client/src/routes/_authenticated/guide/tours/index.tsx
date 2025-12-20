import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/guide/tours/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button asChild>
          <Link to="/guide/tours/new">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create New Tour
          </Link>
        </Button>
      </div>

      <div className="text-center py-8 text-muted-foreground">
        No tours yet. Create your first tour!
      </div>
    </div>
  )
}
