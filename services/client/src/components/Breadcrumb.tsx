import React from 'react'
import { Link, useMatches } from "@tanstack/react-router"
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
import { extractNameFromLoaderData } from '@/lib/route-utils'

export function Breadcrumb() {
  const matches = useMatches()
  console.log({matches});
  // Filter matches that have labels, map them to breadcrumb items
  const breadcrumbItems = matches
    .filter(match => match.staticData.showBreadcrumb)
    .map(match => {
      // Try to extract name from loader data (works for tour, booking, or any entity with a name)
      const dynamicName = extractNameFromLoaderData(match.loaderData)
      const label = dynamicName || match.staticData.label!
      return {
        label,
        path: match.pathname,
      }
    })
    console.log({breadcrumbItems});
    
  
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
