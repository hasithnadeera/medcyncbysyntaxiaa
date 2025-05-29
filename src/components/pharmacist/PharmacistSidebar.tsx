
import { Home, FileText, Settings, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Add any other auth items that need to be cleared
    
    // Redirect to login page
    navigate("/login");
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
      <SidebarMenuButton 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleSignOut}
      >
        <LogOut />
        <span>Sign out</span>
      </SidebarMenuButton>
    </SidebarFooter>
  </Sidebar>;
};

export default PharmacistSidebar;
