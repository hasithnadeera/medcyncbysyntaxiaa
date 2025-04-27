
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This is mock data - replace with real data from your backend
const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2025-04-27",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2025-04-26",
    time: "2:30 PM",
    status: "Completed",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    date: "2025-04-25",
    time: "11:15 AM",
    status: "Completed",
  },
];

export const AppointmentsList = () => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <span 
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                    ${appointment.status === 'Upcoming' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {appointment.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
