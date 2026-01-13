import type { TourDto } from '@rapid-guide-io/contracts'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { profileQueries } from '@/lib/query';


export function createGuideTourColumns(): Array<ColumnDef<TourDto, unknown>> {
  const { data: countries = [] } = useQuery(profileQueries.countries());
  const { data: cities = [] } = useQuery(profileQueries.cities());

  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => {
        const tour = info.row.original
        return (
          <Link
            to="/guide/tours/$tourId"
            params={{ tourId: tour.id }}
            className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer text-left"
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
}