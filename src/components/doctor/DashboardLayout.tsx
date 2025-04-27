
import { useEffect, useState } from 'react';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useDoctorAuth } from "@/utils/authHelpers";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const [doctorName, setDoctorName] = useState<string>("");
  const { checkAccess } = useDoctorAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      const userData = await checkAccess();
      if (userData) {
        setDoctorName(userData.name || '');
      }
    };

    verifyAccess();
  }, [checkAccess]);

  return <SidebarInset className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center h-16 px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-medium text-blue-900">Hello Dr. {doctorName}</h1>
        </div>
      </div>
      <main className="p-6">
        {children}
      </main>
    </SidebarInset>;
};

export default DashboardLayout;
