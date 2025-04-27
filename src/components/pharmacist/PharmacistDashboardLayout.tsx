
import React, { ReactNode } from "react";
import PharmacistSidebar from "./PharmacistSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface PharmacistDashboardLayoutProps {
  children: ReactNode;
}

const PharmacistDashboardLayout = ({ children }: PharmacistDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <PharmacistSidebar />
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

export default PharmacistDashboardLayout;
