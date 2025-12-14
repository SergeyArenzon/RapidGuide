import * as React from "react"
import {
  BarChart3,
  Bell,
  FileText,
  MessageSquare,
  Search,
  Settings,
  Users,
} from "lucide-react"

import Logo from "../Logo"
import { RoleSwitch } from "./RoleSwitch"
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


export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const [activeTab, setActiveTab] = React.useState("analytics")

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
          <RoleSwitch />
          <UserDropdown />
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </SidebarProvider>
  )
}
