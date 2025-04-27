
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Patient = {
  id: string;
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  address: string;
};

export function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      let query = supabase
        .from('users')
        .select('id, name, id_number, phone_number, email, address')
        .eq('role', 'patient');
      
      // Apply filter based on search type
      if (searchType === "name") {
        query = query.ilike('name', `%${searchTerm}%`);
      } else if (searchType === "id") {
        query = query.eq('id_number', searchTerm);
      } else if (searchType === "phone") {
        query = query.eq('phone_number', searchTerm);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Search error:", error);
        return;
      }
      
      setPatients(data || []);
    } catch (error) {
      console.error("Error in search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-6 w-6" />
        Search Patients
      </h2>
      
      <Tabs defaultValue="name" onValueChange={setSearchType} className="mb-6">
        <TabsList>
          <TabsTrigger value="name">By Name</TabsTrigger>
          <TabsTrigger value="id">By ID Number</TabsTrigger>
          <TabsTrigger value="phone">By Phone</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2 mb-6">
        <Input 
          placeholder={`Search by ${searchType === "name" ? "patient name" : searchType === "id" ? "ID number" : "phone number"}`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="bg-medsync-primary hover:bg-medsync-primary/90"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      {hasSearched && (
        <div className="mt-6">
          {patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.id_number}</TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">No patients found matching your search criteria.</p>
          )}
        </div>
      )}
    </Card>
  );
}
