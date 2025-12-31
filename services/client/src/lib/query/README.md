# Query Standardization Guide

This directory contains standardized query utilities for TanStack Query (React Query) to ensure consistency across the application.

## Overview

The query standardization includes:
- **Query Option Factories**: Co-located query keys + query functions (recommended)
- **Query Key Factories**: Centralized, type-safe query keys (for invalidation)
- **Default Query Options**: Consistent query behavior across the app
- **Query Client Configuration**: Global defaults for all queries

## Usage

### 1. Using Query Option Factories (Recommended)

The best approach is to use query option factories that combine query keys with their API calls:

```typescript
import { tourQueries } from '@/lib/query'

// ✅ Best - query option factory (keys + queryFn together)
const { data } = useSuspenseQuery(tourQueries.all())

// ✅ Also works with useQuery
const { data } = useQuery(tourQueries.detail(tourId))

// ✅ Works in loaders too
const tour = await queryClient.ensureQueryData(
  tourQueries.detail(tourId, jwt)
)
```

### 2. Using Query Keys (for invalidation)

Use query key factories when you only need the key (e.g., for invalidation):

```typescript
import { tourQueryKeys } from '@/lib/query'

// ✅ Good - using query key factory for invalidation
queryClient.invalidateQueries({ queryKey: tourQueryKeys.all() })
queryClient.invalidateQueries({ queryKey: tourQueryKeys.detail(tourId) })
```

### 3. Query Options

Default options are automatically applied via QueryClient configuration. You don't need to specify `retry: false` anymore - it's the default.

When using query option factories, defaults are already applied. If you need to override:

```typescript
// Override options when needed
const { data } = useQuery({
  ...tourQueries.all(),
  retry: 3, // Override default
})
```

### 4. Adding New Queries

When adding new queries, create a new query file (e.g., `booking.queries.ts`) following the pattern:

```typescript
// lib/query/booking.queries.ts
import type { BookingDto } from '@rapid-guide-io/contracts';
import Api from '@/lib/api';

export const bookingQueryKeys = {
  all: () => ['bookings'] as const,
  detail: (bookingId: string) => ['booking', bookingId] as const,
  byTour: (tourId: string) => ['bookings', 'tour', tourId] as const,
} as const;

export const bookingQueries = {
  all: () => ({
    queryKey: bookingQueryKeys.all(),
    queryFn: async (): Promise<Array<BookingDto>> => {
      const api = new Api();
      return api.booking.getBookings();
    },
  }),
  
  detail: (bookingId: string) => ({
    queryKey: bookingQueryKeys.detail(bookingId),
    queryFn: async (): Promise<BookingDto> => {
      const api = new Api();
      return api.booking.getBooking(bookingId);
    },
  }),
} as const;
```

Then export from `index.ts`:

```typescript
// lib/query/index.ts
export { bookingQueries, bookingQueryKeys } from './booking.queries';
```

## Default Configuration

The QueryClient is configured with these defaults:

- **retry**: `false` (no automatic retries)
- **refetchOnWindowFocus**: `false`
- **refetchOnReconnect**: `false`
- **staleTime**: 5 minutes
- **gcTime**: 10 minutes (formerly cacheTime)

These defaults can be overridden per-query if needed.

## Migration Guide

To migrate existing queries:

1. **Replace inline query keys + queryFn** with query option factories
2. **Remove redundant options** like `retry: false` (now default)
3. **Update invalidation calls** to use query key factories

Example migration:

```typescript
// Before
const api = new Api()
const { data } = useSuspenseQuery({
  queryKey: ['tours'],
  queryFn: () => api.tour.getTours(),
  retry: false,
})

queryClient.invalidateQueries({ queryKey: ['tours'] })

// After
import { tourQueries, tourQueryKeys } from '@/lib/query'

const { data } = useSuspenseQuery(tourQueries.all())

queryClient.invalidateQueries({ queryKey: tourQueryKeys.all() })
```

## Benefits

- **Co-location**: Query keys and functions are together, easier to maintain
- **Type Safety**: Full TypeScript support for query keys and return types
- **Consistency**: All queries follow the same pattern
- **Less Boilerplate**: No need to manually create Api instances or specify queryFn
- **Better DX**: Easier to discover available queries and their signatures

