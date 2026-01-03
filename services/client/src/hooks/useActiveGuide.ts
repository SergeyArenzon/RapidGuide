import { useRouterState } from "@tanstack/react-router"
import type { MenuTabItem } from "@/components/Sidebar/menuTabs/menuTabs.config"
import { menuTabsConfig } from "@/components/Sidebar/menuTabs/menuTabs.config"
import { useRoleStore } from "@/store/useRole"

export function useActiveGuide(): MenuTabItem | null {
  const { role } = useRoleStore()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (!role) return null

  const menuTabs = menuTabsConfig[role]
  return menuTabs.find((item) => item.route === pathname) ?? null
}

