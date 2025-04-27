
import { useEffect, useState } from 'react';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const [doctorName, setDoctorName] = useState<string>("");
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

        setDoctorName(data[0].name || '');
      } catch (error) {
        console.error("Error in checkDoctorAccess:", error);
        toast.error("An unexpected error occurred");
        navigate('/login');
      }
    };

    checkDoctorAccess();
  }, [navigate]);

  return <SidebarInset className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center h-16 px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-medium text-blue-900">Hello Dr. {doctorName}</h1>
        </div>
      </div>
      <main className="p-6">
        {children}
      </main>
    </SidebarInset>;
};

export default DashboardLayout;
