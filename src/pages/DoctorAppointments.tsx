
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { AppointmentsList } from "@/components/doctor/AppointmentsList";

const DoctorAppointments = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <AppointmentsList />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorAppointments;
