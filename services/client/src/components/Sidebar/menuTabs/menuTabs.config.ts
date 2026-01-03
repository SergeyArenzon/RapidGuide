import { Calendar, LayoutDashboard, Route, Search } from "lucide-react";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { Role } from "@/store/useRole";

export type MenuTabItem = {
  label: string;
  icon: typeof Route;
  route: FileRouteTypes["to"];
}

type MenuTabs = Array<MenuTabItem>

export type MenuTabsConfig = Record<Role, MenuTabs>

export const menuTabsConfig: MenuTabsConfig = {
  guide: [
    { label: "Dashboard", icon: LayoutDashboard, route: "/guide" as FileRouteTypes["to"] },
    { label: "Tours", icon: Route, route: "/guide/tours" as FileRouteTypes["to"] },
    { label: "Calendar", icon: Calendar, route: "/guide/calendar" as FileRouteTypes["to"] },
  ],
  traveller: [
    { label: "Dashboard", icon: LayoutDashboard, route: "/traveller" as FileRouteTypes["to"] },
    { label: "Find Tours", icon: Search, route: "/traveller/tours" as FileRouteTypes["to"] },
  ],
}

// Backward compatibility exports
export type GuideItem = MenuTabItem
export type GuideConfig = MenuTabsConfig
export const guideConfig = menuTabsConfig

