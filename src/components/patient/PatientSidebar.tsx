
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, FileText, Calendar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="border-b flex items-center justify-between py-3">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-semibold">MedSync</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
                tooltip={item.title}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default PatientSidebar;
