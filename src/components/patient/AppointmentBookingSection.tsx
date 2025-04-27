
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Sample available time slots for demonstration
const availableTimeSlots = {
  "2025-05-03": ["09:00", "10:30", "11:15", "14:00", "15:30"],
  "2025-05-04": ["08:30", "10:00", "13:00", "14:30", "16:00"],
  "2025-05-05": ["09:30", "11:00", "13:30", "15:00", "16:30"],
};

const AppointmentBookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Format selected date to lookup in availableTimeSlots
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  
  // Get available time slots for selected date
  const timeSlots = formattedDate ? availableTimeSlots[formattedDate as keyof typeof availableTimeSlots] || [] : [];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select both a date and time slot",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment has been scheduled for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTimeSlot}.`,
    });
    
    // Reset selections after booking
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
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
              // Disable dates in the past
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
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
            timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    className={`w-full ${selectedTimeSlot === time ? "bg-[#1055AE]" : ""}`}
                    onClick={() => setSelectedTimeSlot(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No available time slots for the selected date.
              </p>
            )
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Please select a date to view available time slots.
            </p>
          )}

          {selectedDate && selectedTimeSlot && (
            <div className="mt-6">
              <Button 
                onClick={handleBookAppointment} 
                className="w-full bg-[#1055AE] hover:bg-[#1055AE]/90"
              >
                Book Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBookingSection;
