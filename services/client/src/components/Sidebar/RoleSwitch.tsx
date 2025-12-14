import { Compass, MapPin } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

type LayoutMode = "guide" | "traveller"


export function RoleSwitch() {
    const [layoutMode, setLayoutMode] = useState<LayoutMode>("guide")
    return (
        <div className="px-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Layout Mode</p>
        <div className="flex gap-2">
            <Button
            onClick={() => setLayoutMode("guide")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                layoutMode === "guide"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
            }`}
            >
            <MapPin className="h-4 w-4" />
            <span>Guide</span>
            </Button>
            <Button
            onClick={() => setLayoutMode("traveller")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                layoutMode === "traveller"
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

