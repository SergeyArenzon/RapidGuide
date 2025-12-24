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

export function Breadcrumb() {
  const { location } = useRouterState()
  
  const matches = useMatches()
  const pathname = location.pathname.split('/').filter(Boolean)

  const breadcrumbItems = pathname.map((item, index) => {
    const path = "/" + pathname.slice(0, index + 1).join('/') 
    // get the staticData.label from the matches array by pathname === path
    const match = matches.find(m => m.pathname === path)

    const label = (match?.staticData as { label?: string } | undefined)?.label
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
