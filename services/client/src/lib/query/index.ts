/**
 * Centralized query utilities and configurations
 *
 * This module exports all query-related utilities:
 * - Query key factories
 * - Query options factories (combining keys + API calls)
 * - Default query options
 * - Query client configuration
 */

// Query keys (for invalidation, etc.)
export { tourQueryKeys } from './tour.queries';
export { userQueryKeys } from './user.queries';
export { authQueryKeys } from './auth.queries';
export { reservationQueryKeys } from './reservation.queries';

// Query options factories (keys + queryFn)
export { tourQueries } from './tour.queries';
export { userQueries } from './user.queries';
export { authQueries } from './auth.queries';
export { reservationQueries } from './reservation.queries';

// Legacy query keys export (for backward compatibility)
export { queryKeys } from './query-keys';

// Query options utilities
export {
  defaultQueryOptions,
  createQueryOptions,
  createMutationOptions
} from './query-options';
export { queryClientConfig } from './query-client-config';
