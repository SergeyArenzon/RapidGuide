import { useRouterState } from "@tanstack/react-router"
import type { SidebarTabItem } from "@/components/Sidebar/tabs/tabs.config"
import { sidebarTabs } from "@/components/Sidebar/tabs/tabs.config"
import { useRoleStore } from "@/store/useRole"

export function useActiveTab(): SidebarTabItem | null {
  const { role } = useRoleStore()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (!role) return null

  const tabs = sidebarTabs[role]
  return tabs.find((tab) => tab.route === pathname) ?? null
}

