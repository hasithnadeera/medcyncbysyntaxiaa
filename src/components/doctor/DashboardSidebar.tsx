
import { Home, Search, Calendar, Activity, LogOut, UserPlus, Users } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Home",
    icon: Home,
    path: "/doctor-dashboard"
  },
  {
    title: "Search Patients",
    icon: Search,
    path: "/doctor-dashboard/search"
  },
  {
    title: "Appointments",
    icon: Calendar,
    path: "/doctor-dashboard/appointments"
  },
  {
    title: "Patient Analytics",
    icon: Activity,
    path: "/doctor-dashboard/analytics"
  }
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.path)} tooltip={item.title}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/patient-signup")} tooltip="Add New Patient">
                  <UserPlus className="h-5 w-5" />
                  <span>Add New Patient</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/doctor-dashboard/pharmacists")} tooltip="Manage Pharmacists">
                  <Users className="h-5 w-5" />
                  <span>Manage Pharmacists</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenuButton
          onClick={() => navigate("/")}
          className="w-full justify-start text-red-600 hover:text-red-700"
          tooltip="Sign Out"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
