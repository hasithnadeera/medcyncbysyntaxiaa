
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const PatientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === "/patient-dashboard"}
              onClick={() => navigate("/patient-dashboard")}
              tooltip="Home"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenuButton
          onClick={() => navigate("/")}
          className="w-full justify-start text-red-600 hover:text-red-700 p-4"
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

