
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, FileText, Calendar, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [{
    title: "Home",
    icon: Home,
    path: "/patient-dashboard"
  }, {
    title: "Profile",
    icon: User,
    path: "/patient-dashboard/profile"
  }, {
    title: "Medical Records",
    icon: FileText,
    path: "/patient-dashboard/medical-records"
  }, {
    title: "Appointments",
    icon: Calendar,
    path: "/patient-dashboard/appointments"
  }];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return <Sidebar>
    <SidebarHeader className="flex justify-center items-center p-4">
      <img 
        src="https://img.playbook.com/FreYCFlPY6LTRuNb4jErz3lhmTHkos8Iymufb10FfP4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzYzYWQxZmU2/LTgyNDQtNGQ2Zi1h/OTk1LWI3NzJmOGI2/OTc2ZA" 
        alt="MedSync Logo" 
        className="h-12 w-auto"
      />
    </SidebarHeader>
      
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map(item => <SidebarMenuItem key={item.path}>
                <SidebarMenuButton isActive={location.pathname === item.path} onClick={() => navigate(item.path)} tooltip={item.title}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="border-t p-4">
      <SidebarMenuButton onClick={handleSignOut} className="w-full justify-start text-red-600 hover:text-red-700" tooltip="Sign Out">
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </SidebarMenuButton>
    </SidebarFooter>
  </Sidebar>;
};

export default PatientSidebar;
