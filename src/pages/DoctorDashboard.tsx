import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import HomeContent from "@/components/doctor/HomeContent";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const DoctorDashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Use the new get_user_profile function to fetch user data
        const {
          data,
          error
        } = await supabase.rpc('get_user_profile', {
          user_id: user.id
        });
        if (error) {
          console.error("Error fetching user data:", error);
          toast.error("Could not retrieve your profile information");
        } else if (data && data.length > 0 && data[0].name) {
          setUserName(data[0].name);
        }
      } catch (error) {
        console.error("Error in fetchUserName:", error);
        toast.error("An unexpected error occurred");
      }
    };
    fetchUserName();
  }, [navigate]);
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <div className="mb-6">
              
            </div>
            <HomeContent />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>;
};
export default DoctorDashboard;