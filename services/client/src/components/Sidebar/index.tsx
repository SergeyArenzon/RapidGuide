import { Search } from "lucide-react"
import Logo from "../Logo"
import { RoleSwitch } from "./RoleSwitch"
import { UserDropdown } from "./UserDropdown"
import MenuTabs from "./menuTabs"
import PreferencesMenu from "./preferences"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useRoleStore } from "@/store/useRole"


export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const { role } = useRoleStore(state => state)
  
  const capitalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : ""

  return (
    <SidebarProvider>
      <ShadcnSidebar side="left" className="h-full" {...props}>
        <SidebarHeader>
          <Logo />
          <div className="relative px-4 py-2">
            <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-9" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{capitalizedRole} Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <MenuTabs />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Notifications</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* {tabs.slice(3, 5).map((tab) => (
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
                ))} */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarGroupContent>
              <PreferencesMenu />
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
