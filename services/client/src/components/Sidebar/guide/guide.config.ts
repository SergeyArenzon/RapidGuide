import { Calendar, LayoutDashboard, Route } from "lucide-react";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { Role } from "@/store/useRole";

export type GuideItem = {
  label: string;
  icon: typeof Route;
  route: FileRouteTypes["to"];
}

type Guide = Array<GuideItem>

export type GuideConfig = Record<Role, Guide>

export const guideConfig: GuideConfig = {
  guide: [
    { label: "Dashboard", icon: LayoutDashboard, route: "/guide" as FileRouteTypes["to"] },
    { label: "Tours", icon: Route, route: "/guide/tours" as FileRouteTypes["to"] },
    { label: "Calendar", icon: Calendar, route: "/guide/calendar" as FileRouteTypes["to"] },
  ],
  traveller: [
    // { label: "Dashboard", icon: LayoutDashboard, route: "/traveller" as FileRouteTypes["to"] },
    // { label: "Tours", icon: Route, route: "/traveller/tours" as FileRouteTypes["to"] },
  ],
}

