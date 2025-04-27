
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

type Prescription = {
  id: string;
  patient_id: string;
  patientName: string;
  medicines: {
    details: string;
    illness: string;
    symptoms: string;
    notes?: string;
  };
  status: string;
  created_at: string;
};

export function PrescriptionManager() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          id, patient_id, medicines, status, created_at,
          users:patient_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching prescriptions:", error);
        return;
      }
      
      // Transform data to include patient name and ensure proper type for medicines
      const formattedData = data.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        patientName: item.users?.name || 'Unknown',
        // Cast the medicines as the expected type or provide defaults
        medicines: {
          details: typeof item.medicines === 'object' ? (item.medicines as any)?.details || '' : '',
          illness: typeof item.medicines === 'object' ? (item.medicines as any)?.illness || '' : '',
          symptoms: typeof item.medicines === 'object' ? (item.medicines as any)?.symptoms || '' : '',
          notes: typeof item.medicines === 'object' ? (item.medicines as any)?.notes || undefined : undefined
        },
        status: item.status,
        created_at: item.created_at
      })) as Prescription[];
      
      setPrescriptions(formattedData);
    } catch (error) {
      console.error("Error in fetchPrescriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markPrescriptionIssued = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ status: 'Issued' })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating prescription:", error);
        toast.error("Failed to update prescription status");
        return;
      }
      
      toast.success("Prescription marked as issued");
      fetchPrescriptions();
    } catch (error) {
      console.error("Error in markPrescriptionIssued:", error);
      toast.error("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Prescriptions</h2>
      
      {isLoading ? (
        <p className="text-center py-4">Loading prescriptions...</p>
      ) : prescriptions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Illness</TableHead>
              <TableHead>Prescription</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.patientName}</TableCell>
                <TableCell>{prescription.medicines.illness}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {prescription.medicines.details}
                </TableCell>
                <TableCell>{formatDate(prescription.created_at)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    prescription.status === 'Issued' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prescription.status}
                  </span>
                </TableCell>
                <TableCell>
                  {prescription.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => markPrescriptionIssued(prescription.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Mark Done
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center py-4 text-gray-500">No prescriptions found.</p>
      )}
    </Card>
  );
}
