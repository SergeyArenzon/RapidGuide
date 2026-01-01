import { Calendar } from "lucide-react";
import type { Clock } from "lucide-react";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { Role } from "@/store/useRole";

export type PreferenceItem = {
  label: string;
  icon: typeof Clock;
  route: FileRouteTypes["to"];
}

type Preferences = Array<PreferenceItem>

export type PreferencesConfig = Record<Role, Preferences>

export const preferencesConfig: PreferencesConfig = {
  guide: [
    // { label: "Calendar", icon: Calendar, route: "/guide/preferences/calendar" as FileRouteTypes["to"] },
  ],
  traveller: [],
}

