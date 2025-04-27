
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";

type Appointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

export function DoctorAppointmentsView() {
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // First, fetch all appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });
      
      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        toast.error("Failed to load appointments");
        setIsLoading(false);
        return;
      }
      
      // Create a map to store patient names by ID
      const patientNames: Record<string, string> = {};
      
      // For each unique patient ID in the appointments, fetch the patient's name
      const uniquePatientIds = [...new Set(appointmentsData.map(app => app.patient_id))];
      
      if (uniquePatientIds.length > 0) {
        const { data: patientsData, error: patientsError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', uniquePatientIds);
        
        if (!patientsError && patientsData) {
          patientsData.forEach(patient => {
            patientNames[patient.id] = patient.name;
          });
        } else {
          console.error("Error fetching patient names:", patientsError);
        }
      }
      
      // Transform the data to include patient names
      const formattedData: Appointment[] = appointmentsData.map(appointment => ({
        id: appointment.id,
        patient_id: appointment.patient_id,
        patient_name: patientNames[appointment.patient_id] || 'Unknown Patient',
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status
      }));
      
      const today = new Date().toISOString().split('T')[0];
      
      // Split appointments into past and upcoming
      const past = formattedData.filter(app => 
        app.appointment_date < today || 
        (app.appointment_date === today && app.status === 'Completed')
      );
      
      const upcoming = formattedData.filter(app => 
        app.appointment_date >= today && 
        app.status !== 'Completed' && 
        app.status !== 'Canceled'
      );
      
      setPastAppointments(past);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error("Error in fetchAppointments:", error);
      toast.error("An error occurred while fetching appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const markAppointmentComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Completed' })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating appointment:", error);
        toast.error("Failed to update appointment status");
        return;
      }
      
      toast.success("Appointment marked as complete");
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error("Error in markAppointmentComplete:", error);
      toast.error("An error occurred while updating the appointment");
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return format(dateObj, "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return `${date} ${time}`;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        Appointments
      </h2>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4" />
            Upcoming Appointments
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1">
            <ArrowDown className="h-4 w-4" />
            Past Appointments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {isLoading ? (
            <p className="text-center py-4">Loading appointments...</p>
          ) : upcomingAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patient_name}</TableCell>
                    <TableCell>
                      {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        appointment.status === 'Booked' ? 'bg-blue-100 text-blue-800' : ''
                      }`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => markAppointmentComplete(appointment.id)}
                        variant="outline"
                      >
                        Mark Complete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-gray-500">No upcoming appointments.</p>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {isLoading ? (
            <p className="text-center py-4">Loading appointments...</p>
          ) : pastAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patient_name}</TableCell>
                    <TableCell>
                      {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        appointment.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-gray-500">No past appointments.</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
