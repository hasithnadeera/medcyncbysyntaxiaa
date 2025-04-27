
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import HomeContent from "@/components/doctor/HomeContent";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (data?.name) {
        setUserName(data.name);
      }
    };

    fetchUserName();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <div className="mb-6">
              <h1 className="text-xl font-semibold tracking-tight">
                Hello, Dr. {userName || "Doctor"}
              </h1>
            </div>
            <HomeContent />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
