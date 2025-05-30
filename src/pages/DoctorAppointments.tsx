
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { DoctorAppointmentsView } from "@/components/doctor/DoctorAppointmentsView";
import { useDoctorAuth } from "@/utils/authHelpers";

const DoctorAppointments = () => {
  const { checkAccess } = useDoctorAuth();

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <DoctorAppointmentsView />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorAppointments;
