import type { MutationOptions, QueryOptions } from '@tanstack/react-query';

/**
 * Default query options used across the application
 * 
 * Note: These are partial options that can be merged with query options.
 * Options like refetchOnWindowFocus are configured at the QueryClient level.
 */
export const defaultQueryOptions = {
  /**
   * Standard query options for most queries
   */
  standard: {
    retry: false,
  } as const,
  
  /**
   * Options for queries that should never retry
   */
  noRetry: {
    retry: false,
  } as const,
  
  /**
   * Options for queries that should retry on failure
   */
  withRetry: {
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  } as const,
  
  /**
   * Options for mutations
   */
  mutation: {
    retry: false,
  } as const,
} as const;

/**
 * Helper function to merge default options with custom options
 */
export function createQueryOptions<TData = unknown, TError = Error>(
  customOptions: Partial<QueryOptions<TData, TError>> = {}
): Partial<QueryOptions<TData, TError>> {
  return {
    ...defaultQueryOptions.standard,
    ...customOptions,
  };
}

/**
 * Helper function to create mutation options with defaults
 */
export function createMutationOptions<TData = unknown, TError = Error, TVariables = void>(
  customOptions: Partial<MutationOptions<TData, TError, TVariables>> = {}
): Partial<MutationOptions<TData, TError, TVariables>> {
  return {
    ...defaultQueryOptions.mutation,
    ...customOptions,
  };
}

