import { createElement } from 'react'
import type { ReactElement } from 'react'
import Loading from '@/components/Loading'

type Loadable<TData> = {
  data: TData | undefined
  isLoading?: boolean
}

/**
 * Small helper “loader” helper to centralize the pattern of:
 * - show `<Loading />` while loading
 * - otherwise render with the loaded data
 *
 * Intended to be used with React Query or any similar "loadable" object.
 *
 * Example:
 * const query = useQuery(...)
 * const content = useLoader(query, (data) => <List data={data} />)
 */
export function useLoader<TData>(
  loadable: Loadable<TData>,
  render: (data: TData) => ReactElement
): ReactElement {
  if (loadable.isLoading) {
    return createElement(Loading)
  }

  // We assume you call this only once data is available or
  // you provide a default value in the query (`data: [] = []` pattern).
  return render(loadable.data as TData)
}


