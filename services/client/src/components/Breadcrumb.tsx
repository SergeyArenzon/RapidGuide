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

export function Breadcrumb() {
  const matches = useMatches()
  
  // Filter matches that have labels and map them to breadcrumb items
  const breadcrumbItems = matches
    .filter(match => match.staticData.label)
    .map(match => ({
      label: match.staticData.label!,
      path: match.pathname,
    }))
  
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
