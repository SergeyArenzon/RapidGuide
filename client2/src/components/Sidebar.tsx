import * as React from "react"
import {
  BarChart3,
  Bell,
  ChevronUp,
  CreditCard,
  FileText,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"

import Logo from "./Logo"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useUserStore from "@/store/useUser"

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const [activeTab, setActiveTab] = React.useState("analytics");
  const { user } = useUserStore();
  // const api = new Api();

  const handleLogout = () => {
    try {
      // Send logout request to backend
      // await api.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with logout even if backend request fails
    } finally {
      // Always call NextAuth signOut
      // signOut();
    }
  };

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
        <SidebarFooter className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? undefined} referrerPolicy="no-referrer"/>
                  <AvatarFallback>{`${user?.name?.charAt(0)}${user?.name?.charAt(0)}`}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">{`${user?.name}`}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </SidebarProvider>
  )
}

