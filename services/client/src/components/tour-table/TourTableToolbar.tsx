import { CirclePlus, Settings2 } from 'lucide-react'
import type { Column, VisibilityState } from '@tanstack/react-table'
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

interface TourTableToolbarProps {
  toggleableColumns: Array<Column<TourDto>>
  columnVisibility: VisibilityState
  onCreate?: () => void
}

export function TourTableToolbar({ toggleableColumns, columnVisibility, onCreate }: TourTableToolbarProps) {
  

    
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
              Create Tour
            </Button>
          )}
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toggleableColumns.map((column) => {
              const isVisible = column.getIsVisible()
              console.log({columnId: column.id, isVisible, columnVisibility});
              
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={isVisible}
                  onCheckedChange={(checked) => {
                    column.toggleVisibility(!!checked)
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
