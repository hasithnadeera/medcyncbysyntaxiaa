
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { PharmacistList } from "@/components/doctor/PharmacistList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PharmacistManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkDoctorAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to access the dashboard");
          navigate('/login');
          return;
        }

        // Get user profile including role
        const { data, error } = await supabase.rpc('get_user_profile', {
          user_id: user.id
        });

        if (error) {
          console.error("Error fetching user data:", error);
          toast.error("Could not verify your access");
          navigate('/login');
          return;
        }

        if (!data || data.length === 0 || data[0].role !== 'doctor') {
          toast.error("Unauthorized access. This area is for doctors only.");
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error("Error in checkDoctorAccess:", error);
        toast.error("An unexpected error occurred");
        navigate('/login');
      }
    };

    checkDoctorAccess();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <PharmacistList />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PharmacistManagement;
