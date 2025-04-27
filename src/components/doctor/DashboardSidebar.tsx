
import { 
  Home, 
  Search, 
  Calendar, 
  Activity, 
  LogOut,
  UserPlus 
} from "lucide-react";
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
  { title: "Home", icon: Home, path: "/doctor-dashboard" },
  { title: "Search Patients", icon: Search, path: "/doctor-dashboard/search" },
  { title: "Appointments", icon: Calendar, path: "/doctor-dashboard/appointments" },
  { title: "Patient Analytics", icon: Activity, path: "/doctor-dashboard/analytics" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/patient-signup")}
                  tooltip="Add New Patient"
                >
                  <UserPlus />
                  <span>Add New Patient</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => console.log("Logout clicked")}
              tooltip="Logout"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="text-red-500" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

