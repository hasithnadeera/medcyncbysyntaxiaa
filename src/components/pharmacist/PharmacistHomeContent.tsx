
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
import { useEffect } from "react";

const PharmacistHomeContent = () => {
  //dummy data for pending prescriptions
  const dummyPrescriptions = [
    {
      id: "1",
      patient: {
        name: "Jaliya Perera",
        phone_number: "0712345678"
      },
      medicines: [
        "Amoxicillin 250mg - 3 times daily",
        "Ibuprofen 400mg - as needed for pain"
      ],
      status: "Pending",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      patient: {
        name: "Lasith Perera",
        phone_number: "0723456789"
      },
      medicines: [
        "Amoxicillin 250mg - 3 times daily",
        "Ibuprofen 400mg - as needed for pain"
      ],
      status: "Pending",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      patient: {
        name: "Dhanika Perera",
        phone_number: "0744567890"
      },
      medicines: [
        "Amoxicillin 250mg - 3 times daily",
        "Ibuprofen 400mg - as needed for pain"
      ],
      status: "Pending",
      created_at: new Date().toISOString()
    }
  ];

  // Modify the existing usePrescriptions hook to use dummy data
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();
  
  // Use useEffect to log the real data but display dummy data
  useEffect(() => {
    if (error) {
      console.error("Error fetching prescriptions:", error);
    }
    console.log("Fetched prescriptions from DB:", prescriptions);
    console.log("Using dummy prescriptions for display");
  }, [prescriptions, error]);
  const { data: todayStats } = useTodayPrescriptionStats();

  // Update the useEffect to provide more detailed logging
  useEffect(() => {
    if (error) {
      console.error("Error fetching prescriptions:", error);
      // Try to fetch directly to debug
      const fetchDirectly = async () => {
        try {
          const { data, error: directError } = await supabase
            .from('prescriptions')
            .select('id, status')
            .eq('status', 'Pending');
          
          if (directError) {
            console.error("Direct fetch error:", directError);
          } else {
            console.log("Direct fetch result:", data);
          }
        } catch (e) {
          console.error("Direct fetch exception:", e);
        }
      };
      
      fetchDirectly();
    }
    console.log("Fetched prescriptions:", prescriptions);
  }, [prescriptions, error]);

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
            <div className="text-2xl font-bold">{dummyPrescriptions.length}</div>
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
              {/* Replace the conditional rendering with dummy data */}
              {dummyPrescriptions.map((prescription) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistHomeContent;
