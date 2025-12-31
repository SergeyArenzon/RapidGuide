import { Compass, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { useRoleStore } from "@/store/useRole"
import { Route } from "@/routes/__root" 

export function RoleSwitch() {
  const { role, setRole } = useRoleStore()
  const { guide, traveller } = Route.useRouteContext();

  return (
    <div className="px-2">
      <p className="text-xs font-medium text-muted-foreground mb-2">Layout Mode</p>
      <div className="flex gap-2">
        <Button
          disabled={!guide}
          onClick={() => setRole("guide")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            role === "guide"
              ? "bg-primary text-primary-foreground"
              : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Guide</span>
        </Button>
        <Button
          disabled={!traveller}
          onClick={() => setRole("traveller")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            role === "traveller"
              ? "bg-primary text-primary-foreground"
              : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Traveller</span>
        </Button>
      </div>
    </div>
  )
}

