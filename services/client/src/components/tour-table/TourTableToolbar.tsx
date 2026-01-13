import type { Table as ReactTableInstance, VisibilityState } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CirclePlus, Settings2 } from 'lucide-react'

interface TourTableToolbarProps {
  table: ReactTableInstance<TourDto>
  columnVisibility: VisibilityState
  onCreate?: () => void
  name?: string
}

export function TourTableToolbar({ table, columnVisibility, onCreate, name }: TourTableToolbarProps) {
  // Filter columns that can be hidden
  const columns = table
    .getAllColumns()
    .filter(
      (column) => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    )
  
  // Use columnVisibility in the render to ensure React tracks it as a dependency
  // This ensures the component re-renders when columnVisibility changes
  // The key helps with Radix UI's portal rendering which can sometimes miss prop updates
  const visibilityKey = Object.keys(columnVisibility).sort().join(',')
  
  return (
    <div className="flex items-center gap-2 p-3">
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="inline-flex h-8 items-center gap-1"
            >
              <Settings2 className="h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          {onCreate && (
            <Button
              size="sm"
              className="inline-flex h-8 items-center gap-1"
              onClick={onCreate}
            >
              <CirclePlus className="h-4 w-4" />
              {name ? `Create ${name}` : 'Create'}
            </Button>
          )}
          <DropdownMenuContent align="end" className="w-40" key={visibilityKey}>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => {
              // Read visibility state - this ensures we get the latest value
              // even with Radix UI's portal rendering
              const isVisible = column.getIsVisible()
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={isVisible}
                  onCheckedChange={(checked) => {
                    column.toggleVisibility(checked)
                  }}
                >
                  {column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
