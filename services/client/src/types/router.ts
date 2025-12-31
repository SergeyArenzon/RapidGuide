// Type definition for route staticData in TanStack Router
// Using declaration merging to extend StaticDataRouteOption
// See: https://tanstack.com/router/v1/docs/framework/react/guide/static-route-data
declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    label?: string
    description?: string,
    showBreadcrumb?: boolean
  }
}

// Export type for convenience (optional, for explicit typing if needed)
export interface RouteStaticData {
  label?: string
  description?: string,
  showBreadcrumb?: boolean
}

