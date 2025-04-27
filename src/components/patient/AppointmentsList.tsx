
import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, AlertCircle, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Appointment = Database['public']['Tables']['appointments']['Row'];

const AppointmentsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    data: appointments, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        throw new Error("Not authenticated");
      }

      // Use the RPC function to get appointments instead of direct table access
      const { data, error } = await supabase
        .rpc('get_user_appointments')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      return data as Appointment[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      // Get the current user's ID first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      // Instead of directly deleting from the table, create and use an RPC function to delete appointments
      // This will avoid the RLS recursion issue
      const { data, error } = await supabase.rpc('delete_appointment', {
        appointment_id: appointmentId,
      });

      if (error) {
        console.error("Error in delete_appointment RPC:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete appointment: ${error.message}`);
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments?.filter(
    (apt) => new Date(apt.appointment_date) >= today
  ) || [];

  const pastAppointments = appointments?.filter(
    (apt) => new Date(apt.appointment_date) < today
  ) || [];

  const AppointmentItem = ({ appointment }: { appointment: Appointment }) => (
    <div className="flex items-start space-x-4 border-b last:border-b-0 pb-4 mb-4 last:mb-0">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          <span className="font-medium">
            {new Date(appointment.appointment_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-1 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{appointment.appointment_time}</span>
        </div>
        <div className="mt-1">
          <span className={`text-sm ${
            appointment.status === 'Completed' 
              ? 'text-green-600' 
              : appointment.status === 'Canceled' 
                ? 'text-red-600' 
                : 'text-blue-600'
          }`}>
            {appointment.status}
          </span>
        </div>
      </div>
      {appointment.status !== 'Completed' && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => deleteAppointmentMutation.mutate(appointment.id)}
          disabled={deleteAppointmentMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load appointments. Please try again later.
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading appointments...</p>
          ) : upcomingAppointments?.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <p className="text-muted-foreground">No upcoming appointments.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading appointments...</p>
          ) : pastAppointments?.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <p className="text-muted-foreground">No past appointments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsList;
