// columns.tsx
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import type { TourDto } from '@rapid-guide-io/contracts'
import { userQueries } from '@/lib/query'
import { useRoleStore } from '@/store/useRole'

export function useTourColumns() {
  const { data: countries = [] } = useQuery(userQueries.countries())
  const { data: cities = [] } = useQuery(userQueries.cities())
  const { role } = useRoleStore()
  console.log({});
  
  const columns: Array<ColumnDef<TourDto, any>> = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => {
        if (!role) return null
        const tour = info.row.original
        return (
          <Link
            to={`/${role}/tours/$tourId`}
            params={{ tourId: tour.id }}
            className="cursor-pointer text-left font-medium text-foreground hover:text-primary hover:underline"
          >
            {info.getValue<string>()}
          </Link>
        )
      },
    },
    {
      accessorKey: 'country_code',
      header: 'Country',
      cell: (info) => {
        const countryCode = info.getValue<string>()
        const country = countries.find((c) => c.code === countryCode)
        return (
          <span className="text-sm text-muted-foreground">
            {country?.name || countryCode}
          </span>
        )
      },
    },
    {
      accessorKey: 'city_id',
      header: 'City',
      cell: (info) => {
        const cityId = info.getValue<number>()
        const city = cities.find((c) => c.id === cityId)
        return (
          <span className="text-sm text-muted-foreground">
            {city?.name || cityId}
          </span>
        )
      },
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue<number>()} min
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          ${info.getValue<number>().toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {info.getValue<string>()}
        </p>
      ),
    },
  ]

  return columns
}