
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PharmacistDashboardLayout from "@/components/pharmacist/PharmacistDashboardLayout";
import PharmacistHomeContent from "@/components/pharmacist/PharmacistHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PharmacistDashboard = () => {
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
    <PharmacistDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold tracking-tight">
            Hello, {userName || "Pharmacist"}
          </h1>
        </div>
        <PharmacistHomeContent />
      </div>
    </PharmacistDashboardLayout>
  );
};

export default PharmacistDashboard;
