
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { PharmacistList } from "@/components/doctor/PharmacistList";

const PharmacistManagement = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <PharmacistList />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PharmacistManagement;
