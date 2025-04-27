
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { useDoctorAuth } from "@/utils/authHelpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecordForm } from "@/components/doctor/MedicalRecordForm";
import { PatientSearch } from "@/components/doctor/PatientSearch";
import { DoctorAppointmentsView } from "@/components/doctor/DoctorAppointmentsView";
import { PrescriptionManager } from "@/components/doctor/PrescriptionManager";

const DoctorDashboard = () => {
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
            <Tabs defaultValue="records" className="mb-6">
              <TabsList>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="search">Search Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="records" className="mt-6">
                <MedicalRecordForm />
              </TabsContent>
              
              <TabsContent value="search" className="mt-6">
                <PatientSearch />
              </TabsContent>
              
              <TabsContent value="appointments" className="mt-6">
                <DoctorAppointmentsView />
              </TabsContent>
              
              <TabsContent value="prescriptions" className="mt-6">
                <PrescriptionManager />
              </TabsContent>
            </Tabs>
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
