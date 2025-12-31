import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClientConfig } from '@/lib/query/query-client-config'

export function getContext() {
  const queryClient = new QueryClient(queryClientConfig)
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
