
import { 
  Home, 
  Search, 
  Calendar, 
  Activity, 
  LogOut, 
  UserPlus, 
  Users, 
  FilePen,
  Check 
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
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
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
    title: "Medical Records",
    icon: FilePen,
    path: "/doctor-dashboard/records"
  },
  {
    title: "Prescriptions",
    icon: Check,
    path: "/doctor-dashboard/prescriptions"
  }
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Sidebar>
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
}
