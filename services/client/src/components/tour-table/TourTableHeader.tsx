// TourTableHeader.tsx
import type { HeaderGroup, Table as ReactTableInstance, RowSelectionState, VisibilityState } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { flexRender } from '@tanstack/react-table'

interface TourTableHeaderProps {
  headerGroups: HeaderGroup<TourDto>[]
  toggleAllPageRowsSelected: (value: boolean) => void,
  checked: boolean
}

export function TourTableHeader({ headerGroups, checked, toggleAllPageRowsSelected }: TourTableHeaderProps) {

  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </TableHead>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      ))}
    </TableHeader>
  )
}