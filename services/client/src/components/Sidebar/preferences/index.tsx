import { useRouter, useRouterState } from "@tanstack/react-router"
import { preferencesConfig } from "./preferences.config"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useRoleStore } from "@/store/useRole"

const PreferencesMenu = () => {
  const { role } = useRoleStore()
  const router = useRouter()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  
  if (!role) return null
  
  const preferences = preferencesConfig[role]
  
  if (preferences.length === 0) return null
  
  // Get all routes for the current role, sorted by length (longest first) to prioritize more specific routes
  const allRoutes = preferences.map(item => item.route).sort((a, b) => b.length - a.length)
  
  const isActive = (itemRoute: string) => {
    // Check if this route matches the current pathname
    const matches = pathname === itemRoute || pathname.startsWith(itemRoute + '/')
    
    if (!matches) return false
    
    // Check if there's a more specific route that also matches
    // If so, this route should not be active
    const moreSpecificRoute = allRoutes.find(route => 
      route !== itemRoute && 
      route.length > itemRoute.length &&
      (pathname === route || pathname.startsWith(route + '/'))
    )
    
    return !moreSpecificRoute
  }
  
  return (
    <SidebarMenu>
      {preferences.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            isActive={isActive(item.route)}
            onClick={() => router.navigate({ to: item.route })}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default PreferencesMenu

