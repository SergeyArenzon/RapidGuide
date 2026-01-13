import type { VisibilityState, ColumnDef, Column } from '@tanstack/react-table'
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
  columns: Array<Column<TourDto>>
  onToggleColumn: (columnId: string, visible: boolean) => void
  onCreate?: () => void
  name?: string
}

export function TourTableToolbar({ columns, onToggleColumn, onCreate, name }: TourTableToolbarProps) {
 
  
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => {
              console.log({column});
              
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) => {
                    onToggleColumn(column.id, checked as boolean)
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
