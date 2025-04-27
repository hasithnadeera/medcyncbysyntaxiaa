
import { SidebarProvider } from "@/components/ui/sidebar";
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
            <div className="flex items-center gap-4 border-b pb-4 bg-white">
              <img 
                src="https://img.playbook.com/FreYCFlPY6LTRuNb4jErz3lhmTHkos8Iymufb10FfP4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzYzYWQxZmU2/LTgyNDQtNGQ2Zi1h/OTk1LWI3NzJmOGI2/OTc2ZA" 
                alt="MedSync Logo" 
                className="h-8 w-auto mr-4"
              />
              <h1 className="text-lg font-medium">Doctor Dashboard</h1>
            </div>
            <HomeContent />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
