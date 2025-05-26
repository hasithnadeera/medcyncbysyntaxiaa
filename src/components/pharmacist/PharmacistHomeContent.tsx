
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarDays, ListCheck, Check } from "lucide-react";
import { usePrescriptions, useTodayPrescriptionStats } from "@/hooks/use-prescriptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PharmacistHomeContent = () => {
  const { data: prescriptions, isLoading, refetch } = usePrescriptions();
  const { data: todayStats } = useTodayPrescriptionStats();

  const handleMarkAsIssued = async (prescriptionId: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ status: 'Issued' })
        .eq('id', prescriptionId);

      if (error) {
        console.error('Error updating prescription:', error);
        toast.error("Failed to update prescription status");
        return;
      }

      toast.success("Prescription marked as issued");
      refetch();
    } catch (error) {
      console.error('Error in handleMarkAsIssued:', error);
      toast.error("An error occurred");
    }
  };

  const renderMedicines = (medicines: any) => {
    if (!medicines) return "No medicines listed";
    
    if (typeof medicines === 'string') {
      return medicines;
    }
    
    if (typeof medicines === 'object') {
      // Handle the medicines object structure from medical records
      if (medicines.details) {
        return (
          <div className="space-y-1">
            <div><strong>Details:</strong> {medicines.details}</div>
            {medicines.illness && <div><strong>Illness:</strong> {medicines.illness}</div>}
            {medicines.symptoms && <div><strong>Symptoms:</strong> {medicines.symptoms}</div>}
            {medicines.notes && <div><strong>Notes:</strong> {medicines.notes}</div>}
          </div>
        );
      }
      
      // Handle other object structures
      return Object.entries(medicines).map(([key, value], index) => (
        <div key={index}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ));
    }
    
    if (Array.isArray(medicines)) {
      return (
        <ul className="list-disc list-inside">
          {medicines.map((medicine: string, index: number) => (
            <li key={index}>{medicine}</li>
          ))}
        </ul>
      );
    }
    
    return String(medicines);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Prescriptions handled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ListCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pending prescriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.issued || 0}</div>
            <p className="text-xs text-muted-foreground">
              Prescriptions issued today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Prescriptions</CardTitle>
          <CardDescription>Prescriptions waiting to be issued</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : prescriptions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No pending prescriptions</TableCell>
                </TableRow>
              ) : (
                prescriptions?.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.patient?.name || 'Unknown Patient'}</TableCell>
                    <TableCell>{prescription.patient?.phone_number || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      {renderMedicines(prescription.medicines)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                        {prescription.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handleMarkAsIssued(prescription.id)}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Issued
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistHomeContent;
