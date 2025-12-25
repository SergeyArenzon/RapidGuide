import React from 'react'
import { Link, useMatches, useRouterState } from "@tanstack/react-router"
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
// Import router types to ensure declaration merging is applied
import '@/types/router'

export function Breadcrumb() {
  const { location } = useRouterState()
  
  const matches = useMatches()
  const pathname = location.pathname.split('/').filter(Boolean)
  
  // Helper to normalize paths by removing trailing slashes for comparison
  const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'
  
  const breadcrumbItems = pathname.map((_, index) => {
    const path = "/" + pathname.slice(0, index + 1).join('/') 
    // get the staticData.label from the matches array by comparing normalized paths
    const match = matches.find(m => normalizePath(m.pathname) === normalizePath(path))

    // TypeScript now knows the type of staticData from declaration merging
    const label = match?.staticData?.label
    
    return { label, path }
  })
  
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  )
}
