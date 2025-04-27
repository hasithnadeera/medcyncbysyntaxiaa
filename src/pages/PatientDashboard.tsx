
import React, { useEffect, useState } from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePatientAuth } from "@/utils/authHelpers";

const PatientDashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const { checkAccess } = usePatientAuth();
  
  useEffect(() => {
    const verifyAccess = async () => {
      const userData = await checkAccess();
      if (userData) {
        setUserName(userData.name || "");
      }
    };
    
    verifyAccess();
  }, [checkAccess]);
  
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
