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
  
  return (
    <SidebarMenu>
      {sidebarTabs[role].map((tab: any) => (
        <SidebarMenuItem key={tab.id}>
          <SidebarMenuButton
            isActive={pathname === tab.route}
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