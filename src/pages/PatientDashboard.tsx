
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import PatientHomeContent from "@/components/patient/PatientHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold tracking-tight">Patient Dashboard</h1>
        </div>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
