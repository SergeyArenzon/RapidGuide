import { Clock } from "lucide-react";
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
    { label: "Time Slots", icon: Clock, route: "/guide/preferences/time-slots" as FileRouteTypes["to"] },
  ],
  traveller: [],
}

