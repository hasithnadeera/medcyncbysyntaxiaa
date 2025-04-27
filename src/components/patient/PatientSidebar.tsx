
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, FileText, Calendar, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Home",
      icon: Home,
      path: "/patient-dashboard",
    },
    {
      title: "Profile",
      icon: User,
      path: "/patient-dashboard/profile",
    },
    {
      title: "Medical Records",
      icon: FileText,
      path: "/patient-dashboard/medical-records",
    },
    {
      title: "Appointments",
      icon: Calendar,
      path: "/patient-dashboard/appointments",
    },
  ];

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    navigate('/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b flex items-center justify-between py-3">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-semibold">MedSync</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenuButton
          onClick={handleSignOut}
          className="w-full justify-start text-red-600 hover:text-red-700"
          tooltip="Sign Out"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PatientSidebar;
