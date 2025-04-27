
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
import { usePrescriptions } from "@/hooks/use-prescriptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PharmacistHomeContent = () => {
  const { data: prescriptions, isLoading, refetch } = usePrescriptions();

  const handleMarkAsIssued = async (prescriptionId: string) => {
    const { error } = await supabase
      .from('prescriptions')
      .update({ status: 'Issued' })
      .eq('id', prescriptionId);

    if (error) {
      toast.error("Failed to update prescription status");
      return;
    }

    toast.success("Prescription marked as issued");
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Overview</CardTitle>
          <CardDescription>Summary of prescriptions handled today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {prescriptions?.length || 0}
          </div>
          <p className="text-sm text-muted-foreground">Pending prescriptions to be handled</p>
        </CardContent>
      </Card>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Prescriptions</CardTitle>
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
                    <TableCell>{prescription.patient.name}</TableCell>
                    <TableCell>{prescription.patient.phone_number}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {Array.isArray(prescription.medicines) 
                          ? prescription.medicines.map((medicine: string, index: number) => (
                              <li key={index}>{medicine}</li>
                            ))
                          : typeof prescription.medicines === 'string' 
                            ? [prescription.medicines].map((medicine: string, index: number) => (
                                <li key={index}>{medicine}</li>
                              ))
                            : Object.keys(prescription.medicines).map((key: string, index: number) => (
                                <li key={index}>{key}: {String(prescription.medicines[key])}</li>
                              ))
                        }
                      </ul>
                    </TableCell>
                    <TableCell>{prescription.status}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handleMarkAsIssued(prescription.id)}
                      >
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
