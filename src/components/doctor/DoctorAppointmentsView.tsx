
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

type Appointment = {
  id: string;
  patient_id: string;
  patientName: string;
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
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch appointments with patient names
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, patient_id, appointment_date, appointment_time, status,
          users:patient_id (name)
        `)
        .order('appointment_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }
      
      // Transform data to include patient name
      const formattedData = data.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        patientName: item.users?.name || 'Unknown',
        appointment_date: item.appointment_date,
        appointment_time: item.appointment_time,
        status: item.status
      }));
      
      // Split appointments into past and upcoming
      const past = formattedData.filter(app => app.appointment_date < today || 
        (app.appointment_date === today && app.status === 'Completed'));
      const upcoming = formattedData.filter(app => app.appointment_date >= today && 
        app.status !== 'Completed' && app.status !== 'Canceled');
      
      setPastAppointments(past);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error("Error in fetchAppointments:", error);
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
        return;
      }
      
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error("Error in markAppointmentComplete:", error);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      // Format: "April 27, 2025 at 10:30 AM"
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
                    <TableCell>{appointment.patientName}</TableCell>
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
                    <TableCell>{appointment.patientName}</TableCell>
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
