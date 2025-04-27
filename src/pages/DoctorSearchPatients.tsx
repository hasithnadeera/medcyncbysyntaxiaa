
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { PatientSearch } from "@/components/doctor/PatientSearch";
import { useDoctorAuth } from "@/utils/authHelpers";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FilePen } from "lucide-react";

const DoctorSearchPatients = () => {
  const { checkAccess } = useDoctorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Patient Search</h1>
              <Button 
                onClick={() => navigate("/doctor-dashboard")} 
                className="bg-medsync-primary hover:bg-medsync-primary/90 flex items-center gap-2"
              >
                <FilePen className="h-5 w-5" />
                Create Medical Record
              </Button>
            </div>
            <PatientSearch />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorSearchPatients;
