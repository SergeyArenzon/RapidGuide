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
export { profileQueryKeys } from './profile.queries';
export { authQueryKeys } from './auth.queries';

// Query options factories (keys + queryFn)
export { tourQueries } from './tour.queries';
export { profileQueries } from './profile.queries';
export { authQueries } from './auth.queries';

// Legacy query keys export (for backward compatibility)
export { queryKeys } from './query-keys';

// Query options utilities
export { 
  defaultQueryOptions, 
  createQueryOptions, 
  createMutationOptions 
} from './query-options';
export { queryClientConfig } from './query-client-config';

