
import React, { useEffect, useState } from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
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
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold tracking-tight">
            Hello, {userName || "Patient"}
          </h1>
        </div>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
