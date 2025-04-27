import { SidebarProvider } from "@/components/ui/sidebar";
import PharmacistDashboardLayout from "@/components/pharmacist/PharmacistDashboardLayout";
import PharmacistHomeContent from "@/components/pharmacist/PharmacistHomeContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
const PharmacistDashboard = () => {
  return <PharmacistDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <SidebarTrigger />
          
          <h1 className="text-xl font-semibold tracking-tight">Pharmacist Dashboard</h1>
        </div>
        <PharmacistHomeContent />
      </div>
    </PharmacistDashboardLayout>;
};
export default PharmacistDashboard;