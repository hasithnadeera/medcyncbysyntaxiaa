
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Appointment = Database['public']['Tables']['appointments']['Row'];

const AppointmentBookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const queryClient = useQueryClient();

  // Available time slots (in 24-hour format)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00","21:30"
  ];

  // Fetch booked slots for selected date
  const { data: bookedSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['booked-slots', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const { data, error } = await supabase.rpc('get_booked_slots', {
        check_date: format(selectedDate, "yyyy-MM-dd")
      });

      if (error) {
        console.error("Error fetching booked slots:", error);
        throw error;
      }
      
      return data.map(row => row.appointment_time);
    },
    enabled: !!selectedDate
  });

  // Clear selected time slot if it becomes unavailable
  useEffect(() => {
    if (selectedTimeSlot && bookedSlots.includes(selectedTimeSlot)) {
      setSelectedTimeSlot(null);
      toast.warning("The previously selected time slot is no longer available.");
    }
  }, [bookedSlots, selectedTimeSlot]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select both date and time");
      return;
    }

    // Double check if time slot is already booked
    if (bookedSlots.includes(selectedTimeSlot)) {
      toast.error("This time slot is already booked. Please select another time.");
      setSelectedTimeSlot(null);
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
      
      // Invalidate both patient appointments and booked slots queries
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
    } catch (error: any) {
      toast.error("Failed to book appointment: " + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  // Function to check if a time slot is in the past for the selected date
  const isTimeSlotInPast = (timeSlot: string): boolean => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const selectedDay = new Date(selectedDate);
    
    // Only check for current day
    if (
      today.getDate() !== selectedDay.getDate() ||
      today.getMonth() !== selectedDay.getMonth() ||
      today.getFullYear() !== selectedDay.getFullYear()
    ) {
      return false;
    }
    
    // Parse the time slot
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(selectedDay);
    slotTime.setHours(hours, minutes, 0, 0);
    
    // Check if the slot time is in the past
    return slotTime < today;
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
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTimeSlot(null); // Reset time slot when date changes
            }}
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
          {isLoadingSlots && selectedDate ? (
            <p className="text-center text-muted-foreground py-4">
              Loading available time slots...
            </p>
          ) : selectedDate ? (
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => {
                const isPastTimeSlot = isTimeSlotInPast(time);
                return (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    className={`w-full ${
                      selectedTimeSlot === time ? "bg-[#1055AE]" : ""
                    }`}
                    onClick={() => setSelectedTimeSlot(time)}
                    disabled={bookedSlots.includes(time) || isPastTimeSlot}
                  >
                    {time}
                  </Button>
                );
              })}
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
