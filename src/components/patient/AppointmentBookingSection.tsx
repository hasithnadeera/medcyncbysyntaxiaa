
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

type Appointment = Database['public']['Tables']['appointments']['Row'];

const AppointmentBookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Fetch existing appointments for date validation
  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    }
  });

  // Available time slots (in 24-hour format)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  // Filter available time slots for selected date
  const getAvailableTimeSlots = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const bookedSlots = appointments?.filter(apt => 
      apt.appointment_date === dateStr
    ).map(apt => apt.appointment_time) || [];

    return timeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select both date and time");
      return;
    }

    setIsBooking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          appointment_date: format(selectedDate, "yyyy-MM-dd"),
          appointment_time: selectedTimeSlot,
          status: 'Booked'
        });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
    } catch (error: any) {
      toast.error("Failed to book appointment: " + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border pointer-events-auto"
            disabled={(date) => {
              // Disable past dates and weekends
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                date < today ||
                date.getDay() === 0 ||
                date.getDay() === 6
              );
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2">
              {getAvailableTimeSlots(selectedDate).map((time) => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "default" : "outline"}
                  className={`w-full ${
                    selectedTimeSlot === time ? "bg-[#1055AE]" : ""
                  }`}
                  onClick={() => setSelectedTimeSlot(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Please select a date to view available time slots
            </p>
          )}

          {selectedDate && selectedTimeSlot && (
            <div className="mt-6">
              <Button
                onClick={handleBookAppointment}
                className="w-full bg-[#1055AE] hover:bg-[#1055AE]/90"
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Book Appointment"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBookingSection;
