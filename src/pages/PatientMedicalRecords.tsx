
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Prescription = Database['public']['Tables']['prescriptions']['Row'];

const PatientMedicalRecords = () => {
  const { data: prescriptions } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Prescription[];
    }
  });

  const maskMedicineName = (name: string) => {
    if (name.length <= 3) return name;
    return `${name.substring(0, 3)}${'•'.repeat(name.length - 3)}`;
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions && prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border-b pb-4">
                    <p className="text-sm text-gray-500">
                      {new Date(prescription.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      {(prescription.medicines as any[]).map((medicine, index) => (
                        <p key={index} className="text-sm">
                          {maskMedicineName(medicine.name)} - {medicine.dosage}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm mt-2 text-blue-600">
                      Status: {prescription.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No prescription history found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientMedicalRecords;
