
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
