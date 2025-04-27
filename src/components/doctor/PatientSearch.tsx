
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Users, Copy, ClipboardCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      // Use a more direct approach to query patients
      let query;
      if (searchType === "name") {
        // Search by name (case insensitive)
        const {
          data,
          error
        } = await supabase.rpc('search_patients_by_name', {
          search_term: `%${searchTerm}%`
        } as any);
        if (error) throw error;
        query = data;
      } else if (searchType === "id") {
        // Search by ID number (exact match)
        const {
          data,
          error
        } = await supabase.rpc('search_patients_by_id', {
          id_number_param: searchTerm
        } as any);
        if (error) throw error;
        query = data;
      } else if (searchType === "phone") {
        // Search by phone (exact match)
        const {
          data,
          error
        } = await supabase.rpc('search_patients_by_phone', {
          phone_param: searchTerm
        } as any);
        if (error) throw error;
        query = data;
      }
      setPatients(query || []);
    } catch (error) {
      console.error("Error in search:", error);
      toast.error("An error occurred during search");
    } finally {
      setIsSearching(false);
    }
  };
  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("Patient ID copied to clipboard");

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy ID");
    }
  };
  return <Card className="p-6">
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
        <Input placeholder={`Search by ${searchType === "name" ? "patient name" : searchType === "id" ? "ID number" : "phone number"}`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <Button onClick={handleSearch} disabled={isSearching} className="bg-medsync-primary hover:bg-medsync-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      {hasSearched && <div className="mt-6">
          {patients.length > 0 ? <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Patient UUID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map(patient => <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.id_number}</TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{patient.id}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(patient.id)} title="Copy Patient ID" className="h-7 w-7">
                          {copiedId === patient.id ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table> : <p className="text-center text-gray-500">No patients found matching your search criteria.</p>}
        </div>}
    </Card>;
}
