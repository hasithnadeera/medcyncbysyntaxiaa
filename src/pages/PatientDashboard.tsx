
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
          <img 
            src="https://img.playbook.com/FreYCFlPY6LTRuNb4jErz3lhmTHkos8Iymufb10FfP4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzYzYWQxZmU2/LTgyNDQtNGQ2Zi1h/OTk1LWI3NzJmOGI2/OTc2ZA" 
            alt="MedSync Logo" 
            className="h-8 w-auto mr-4"
          />
          <h1 className="text-xl font-semibold tracking-tight">Patient Dashboard</h1>
        </div>
        <PatientHomeContent />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
