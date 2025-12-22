import React from 'react'
import { Link, useRouterState } from "@tanstack/react-router"
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Breadcrumb() {
  const { location } = useRouterState()
  const pathname = location.pathname.split('/').filter(Boolean)

  // Build breadcrumb items with cumulative paths
  const breadcrumbItems = pathname.map((item, index) => {
    const path = '/' + pathname.slice(0, index + 1).join('/')
    return { label: item, path }
  })

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label.charAt(0).toUpperCase() + item.label.slice(1)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label.charAt(0).toUpperCase() + item.label.slice(1)}</Link>
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
