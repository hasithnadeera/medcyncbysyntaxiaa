
import React, { useEffect } from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import { usePatientAuth } from "@/utils/authHelpers";

const PatientProfile = () => {
  const { checkAccess } = usePatientAuth();
  
  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p>Profile page content will be implemented here.</p>
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientProfile;
