import * as React from "react"
import {
  BarChart3,
  Bell,
  Compass,
  FileText,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  Users,
} from "lucide-react"

import Logo from "../Logo"
import { UserDropdown } from "./UserDropdown"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

type LayoutMode = "guide" | "traveller"

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const [activeTab, setActiveTab] = React.useState("analytics")
  const [layoutMode, setLayoutMode] = React.useState<LayoutMode>("guide")

  const tabs = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 5 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <ShadcnSidebar side="right" className="h-full" {...props}>
        <SidebarHeader>
          <Logo />
          <div className="relative px-4 py-2">
            <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-9" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.slice(0, 3).map((tab) => (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Notifications</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.slice(3, 5).map((tab) => (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {tab.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.slice(5).map((tab) => (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4 space-y-3">
          <div className="px-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Layout Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setLayoutMode("guide")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  layoutMode === "guide"
                    ? "bg-primary text-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Guide</span>
              </button>
              <button
                onClick={() => setLayoutMode("traveller")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  layoutMode === "traveller"
                    ? "bg-primary text-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Traveller</span>
              </button>
            </div>
          </div>

          <UserDropdown />
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </SidebarProvider>
  )
}
