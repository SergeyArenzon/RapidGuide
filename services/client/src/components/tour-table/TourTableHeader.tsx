// TourTableHeader.tsx
import { flexRender } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import type { HeaderGroup } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TourTableHeaderProps {
  headerGroups: Array<HeaderGroup<TourDto>>
}

export function TourTableHeader({ headerGroups }: TourTableHeaderProps) {

  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
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