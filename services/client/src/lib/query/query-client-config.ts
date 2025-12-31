import type { QueryClientConfig } from '@tanstack/react-query';

/**
 * Default configuration for QueryClient
 * 
 * This configuration is applied to all QueryClient instances in the application.
 */
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Don't retry by default (most API errors are not transient)
      retry: false,
      // Don't refetch on window focus (reduces unnecessary requests)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect (prevents duplicate requests)
      refetchOnReconnect: false,
      // Stale time: data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache time: keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      // Don't retry mutations by default
      retry: false,
    },
  },
};

