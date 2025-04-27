
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
