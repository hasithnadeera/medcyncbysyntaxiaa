import React from "react";
import { CalendarClock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const upcomingAppointments = [{
  id: 1,
  doctor: "Dr. Emily Johnson",
  specialty: "Dermatologist",
  date: "May 3, 2025",
  time: "10:30 AM"
}, {
  id: 2,
  doctor: "Dr. Michael Smith",
  specialty: "Cardiologist",
  date: "May 15, 2025",
  time: "2:00 PM"
}];
const medicalRecords = [{
  id: 1,
  date: "March 15, 2025",
  doctor: "Dr. Emily Johnson",
  diagnosis: "Seasonal allergies",
  notes: "Prescribed antihistamines for 2 weeks"
}, {
  id: 2,
  date: "January 7, 2025",
  doctor: "Dr. Michael Smith",
  diagnosis: "Annual checkup",
  notes: "All vitals normal, recommended diet adjustments"
}];
const prescriptions = [{
  id: 1,
  name: "Loratadine",
  dosage: "10mg",
  frequency: "Once daily",
  duration: "2 weeks"
}, {
  id: 2,
  name: "Amlodipine",
  dosage: "5mg",
  frequency: "Once daily",
  duration: "Ongoing"
}, {
  id: 3,
  name: "Metformin",
  dosage: "500mg",
  frequency: "Twice daily",
  duration: "Ongoing"
}];
const PatientHomeContent = () => {
  const navigate = useNavigate();
  const maskPrescriptionName = (name: string) => {
    if (name.length <= 3) return name;
    return `${name.substring(0, 3)}${'•'.repeat(name.length - 3)}`;
  };
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <CalendarClock className="h-4 w-4 inline mr-2" />
            Upcoming Appointments
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/patient-dashboard/appointments")}>
            View all
          </Button>
        </CardHeader>
        
        <CardContent>
          {upcomingAppointments.length > 0 ? <div className="space-y-4">
              {upcomingAppointments.map(appointment => <div key={appointment.id} className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{appointment.doctor}</p>
                  <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                  <p className="text-xs font-medium">{appointment.date} at {appointment.time}</p>
                  <hr className="my-1" />
                </div>)}
            </div> : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
        </CardContent>
      </Card>

      

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <FileText className="h-4 w-4 inline mr-2" />
            Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? <div className="space-y-4">
              {prescriptions.map(prescription => <div key={prescription.id} className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{maskPrescriptionName(prescription.name)}</p>
                  <p className="text-xs text-muted-foreground">
                    {prescription.dosage} - {prescription.frequency}
                  </p>
                  <p className="text-xs text-muted-foreground">Duration: {prescription.duration}</p>
                  <hr className="my-1" />
                </div>)}
            </div> : <p className="text-sm text-muted-foreground">No prescriptions found.</p>}
        </CardContent>
      </Card>
    </div>;
};
export default PatientHomeContent;