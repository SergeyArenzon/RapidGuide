import { LayoutDashboard, Route } from "lucide-react";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { Role } from "@/store/useRole";

export type SidebarTabItem = {
  label: string;
  icon: typeof Route;
  route: FileRouteTypes["to"];
}

type SidebarTab = Array<SidebarTabItem>

export type SidebarTabs = Record<Role, SidebarTab>

export const sidebarTabs: Record<Role, SidebarTab> = {
  guide: [
    { label: "Dashboard", icon: LayoutDashboard, route: "/guide" as FileRouteTypes["to"] },
    { label: "Tours", icon: Route, route: "/guide/tours" as FileRouteTypes["to"] },
  ],
  traveller: [
    { label: "Dashboard", icon: LayoutDashboard, route: "/traveller" as FileRouteTypes["to"] },
    { label: "Tours", icon: Route, route: "/traveller/tours" as FileRouteTypes["to"] },
  ],
} 