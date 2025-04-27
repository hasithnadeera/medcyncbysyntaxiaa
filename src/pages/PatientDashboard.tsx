
import React, { useEffect, useState, useContext } from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/App";

const PatientDashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) return;
    
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserName = async () => {
      try {
        // Use the new get_user_profile function to fetch user data
        const { data, error } = await supabase.rpc('get_user_profile', {
          user_id: user.id
        });
        
        if (error) {
          console.error("Error fetching user data:", error);
          toast.error("Could not retrieve your profile information");
        } else if (data && data.length > 0 && data[0].name) {
          setUserName(data[0].name);
        } else {
          console.log("No user data found or name is null");
        }
      } catch (error) {
        console.error("Error in fetchUserName:", error);
        toast.error("An unexpected error occurred");
      }
    };

    fetchUserName();
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold tracking-tight text-blue-800">
            Hello, {userName || "Patient"}
          </h1>
        </div>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
