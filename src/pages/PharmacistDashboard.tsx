
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PharmacistDashboardLayout from "@/components/pharmacist/PharmacistDashboardLayout";
import PharmacistHomeContent from "@/components/pharmacist/PharmacistHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePharmacistAuth } from "@/utils/authHelpers";

const PharmacistDashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const { checkAccess } = usePharmacistAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      const userData = await checkAccess();
      if (userData) {
        setUserName(userData.name || "");
      }
    };
    
    verifyAccess();
  }, [checkAccess]);

  return (
    <PharmacistDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold tracking-tight">
            Hello, {userName || "Pharmacist"}
          </h1>
        </div>
        <PharmacistHomeContent />
      </div>
    </PharmacistDashboardLayout>
  );
};

export default PharmacistDashboard;
