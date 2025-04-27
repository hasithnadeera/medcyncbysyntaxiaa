
import React, { ReactNode } from "react";
import PatientSidebar from "./PatientSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface PatientDashboardLayoutProps {
  children: ReactNode;
}

const PatientDashboardLayout = ({ children }: PatientDashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <PatientSidebar />
        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PatientDashboardLayout;

