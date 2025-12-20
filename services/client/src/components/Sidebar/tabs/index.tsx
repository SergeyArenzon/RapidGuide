import { useRouter, useRouterState } from "@tanstack/react-router"
import { sidebarTabs } from "./tabs.config"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useRoleStore } from "@/store/useRole"



const Tabs = () => {
  const { role } = useRoleStore()
  const router = useRouter()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  
  if (!role) return null
  
  // Get all routes for the current role, sorted by length (longest first) to prioritize more specific routes
  const allRoutes = sidebarTabs[role].map(tab => tab.route).sort((a, b) => b.length - a.length)
  
  const isActive = (tabRoute: string) => {
    // Check if this route matches the current pathname
    const matches = pathname === tabRoute || pathname.startsWith(tabRoute + '/')
    
    if (!matches) return false
    
    // Check if there's a more specific route that also matches
    // If so, this route should not be active
    const moreSpecificRoute = allRoutes.find(route => 
      route !== tabRoute && 
      route.length > tabRoute.length &&
      (pathname === route || pathname.startsWith(route + '/'))
    )
    
    return !moreSpecificRoute
  }
  
  return (
    <SidebarMenu>
      {sidebarTabs[role].map((tab) => (
        <SidebarMenuItem key={tab.label}>
          <SidebarMenuButton
            isActive={isActive(tab.route)}
            onClick={() => router.navigate({ to: tab.route })}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default Tabs