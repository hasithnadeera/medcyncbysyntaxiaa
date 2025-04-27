
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPharmacistForm } from "./AddPharmacistForm";

// Mock data - in a real app this would come from an API
const pharmacists = [
  { id: 1, name: "Dr. Sarah Johnson", phone: "+1 234 567 8901" },
  { id: 2, name: "Dr. Mike Chen", phone: "+1 234 567 8902" },
  { id: 3, name: "Dr. Emily Brown", phone: "+1 234 567 8903" },
];

export const PharmacistList = () => {
  const handleDelete = (id: number) => {
    console.log("Delete pharmacist with id:", id);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Pharmacists</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Pharmacist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Pharmacist</DialogTitle>
            </DialogHeader>
            <AddPharmacistForm />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pharmacists.map((pharmacist) => (
            <TableRow key={pharmacist.id}>
              <TableCell className="font-medium">{pharmacist.name}</TableCell>
              <TableCell>{pharmacist.phone}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(pharmacist.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
