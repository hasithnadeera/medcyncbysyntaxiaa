import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddPharmacistForm } from "./AddPharmacistForm";

// Mock data - in a real app this would come from an API
const pharmacists = [{
  id: 1,
  name: "Dr. Sarah Johnson",
  phone: "07234567890"
}, {
  id: 2,
  name: "Dr. Mike Chen",
  phone: "07234567891"
}, {
  id: 3,
  name: "Dr. Emily Brown",
  phone: "07234567892"
}];

export const PharmacistList = () => {
  const handleDelete = (id: number) => {
    console.log("Delete pharmacist with id:", id);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-medsync-primary hover:bg-medsync-primary/90 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Pharmacist
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
          {pharmacists.map(pharmacist => <TableRow key={pharmacist.id}>
              <TableCell className="font-medium">{pharmacist.name}</TableCell>
              <TableCell>{pharmacist.phone}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(pharmacist.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </Card>
  );
};
