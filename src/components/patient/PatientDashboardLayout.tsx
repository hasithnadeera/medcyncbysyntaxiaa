
import React, { ReactNode } from "react";
import PatientSidebar from "./PatientSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface PatientDashboardLayoutProps {
  children: ReactNode;
}

const PatientDashboardLayout = ({ children }: PatientDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <PatientSidebar />
          <SidebarInset className="px-4 md:px-8 py-6">
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PatientDashboardLayout;
