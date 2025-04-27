
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <div className="flex items-center gap-4 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-medium">Patient Dashboard</h1>
      </div>
      <div className="p-4">
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;

