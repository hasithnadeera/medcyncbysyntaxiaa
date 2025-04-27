import { Home, FileText, Settings, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
const sidebarItems = [{
  title: "Home",
  icon: Home,
  path: "/pharmacist-dashboard"
}, {
  title: "Prescriptions",
  icon: FileText,
  path: "/pharmacist-dashboard/prescriptions"
}, {
  title: "Settings",
  icon: Settings,
  path: "/pharmacist-dashboard/settings"
}];
const PharmacistSidebar = () => {
  return <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut />
          <span>Sign out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>;
};
export default PharmacistSidebar;