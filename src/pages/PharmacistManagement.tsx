
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/doctor/DashboardLayout";
import { DashboardSidebar } from "@/components/doctor/DashboardSidebar";
import { PharmacistList } from "@/components/doctor/PharmacistList";
import { useDoctorAuth } from "@/utils/authHelpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPharmacistForm } from "@/components/doctor/AddPharmacistForm";
import { UserPlus } from "lucide-react";

const PharmacistManagement = () => {
  const { checkAccess } = useDoctorAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <DashboardLayout>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Pharmacists</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-medsync-primary hover:bg-medsync-primary/90 flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add New Pharmacist
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Pharmacist</DialogTitle>
                    <DialogDescription>
                      Enter the pharmacist details below to register them in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <AddPharmacistForm />
                </DialogContent>
              </Dialog>
            </div>
            <PharmacistList />
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PharmacistManagement;
