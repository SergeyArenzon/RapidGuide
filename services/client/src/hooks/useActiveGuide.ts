import { useRouterState } from "@tanstack/react-router"
import type { GuideItem } from "@/components/Sidebar/guide/guide.config"
import { guideConfig } from "@/components/Sidebar/guide/guide.config"
import { useRoleStore } from "@/store/useRole"

export function useActiveGuide(): GuideItem | null {
  const { role } = useRoleStore()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (!role) return null

  const guide = guideConfig[role]
  return guide.find((item) => item.route === pathname) ?? null
}

