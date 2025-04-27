
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Appointment = Database['public']['Tables']['appointments']['Row'];

const AppointmentsList = () => {
  const { data: appointments } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
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
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
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
          {pastAppointments.length > 0 ? (
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
