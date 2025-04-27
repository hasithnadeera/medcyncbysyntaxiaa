
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

// Mock data - in a real app this would come from an API
const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2025-04-27",
    time: "09:00 AM",
    status: "Completed",
    type: "Check-up"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2025-04-27",
    time: "10:30 AM",
    status: "Upcoming",
    type: "Follow-up"
  },
  {
    id: 3,
    patientName: "Bob Wilson",
    date: "2025-04-26",
    time: "02:00 PM",
    status: "Completed",
    type: "Consultation"
  }
];

export const AppointmentsList = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Appointments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  appointment.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
