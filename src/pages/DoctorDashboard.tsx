
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import HomeContent from "@/components/doctor/HomeContent";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";

const DoctorDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <HomeContent />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
