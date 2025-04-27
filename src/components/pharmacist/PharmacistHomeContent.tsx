
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PharmacistHomeContent = () => {
  return (
    <div className="space-y-8">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Overview</CardTitle>
          <CardDescription>Summary of prescriptions handled today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">Total prescriptions handled today</p>
        </CardContent>
      </Card>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Prescription Code</TableHead>
                <TableHead>Medication Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>RX123456</TableCell>
                <TableCell>Amoxicillin 500mg</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>
                  <Button size="sm">Mark as Issued</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Issued Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Issued Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Prescription Code</TableHead>
                <TableHead>Medication Details</TableHead>
                <TableHead>Issue Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>RX123455</TableCell>
                <TableCell>Ibuprofen 400mg</TableCell>
                <TableCell>2025-04-27</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistHomeContent;
