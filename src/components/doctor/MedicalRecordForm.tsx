
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FilePen } from "lucide-react";

const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  illness: z.string().min(1, "Illness is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  prescription: z.string().min(1, "Prescription is required"),
  notes: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

export function MedicalRecordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      patientId: "",
      illness: "",
      symptoms: "",
      prescription: "",
      notes: "",
    },
  });

  async function onSubmit(data: MedicalRecordFormValues) {
    setIsSubmitting(true);
    
    try {
      // First, verify patient exists
      const { data: patientData, error: patientError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.patientId)
        .eq('role', 'patient')
        .single();
        
      if (patientError || !patientData) {
        toast.error("Patient not found. Please check the Patient ID");
        setIsSubmitting(false);
        return;
      }
      
      // Create prescription record with medicines as JSON
      const medicines = {
        details: data.prescription,
        illness: data.illness,
        symptoms: data.symptoms,
        notes: data.notes
      };
      
      const { error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: data.patientId,
          medicines: medicines,
          status: 'Pending'
        });
        
      if (prescriptionError) {
        console.error("Error creating prescription:", prescriptionError);
        toast.error("Failed to create medical record");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Medical record created successfully");
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An error occurred while creating the medical record");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FilePen className="h-5 w-5" />
        Create Medical Record
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="illness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Illness</FormLabel>
              <FormControl>
                <Input placeholder="Enter illness" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the symptoms" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescription</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter prescription details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="bg-medsync-primary hover:bg-medsync-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Medical Record"}
        </Button>
      </form>
    </Form>
  );
}
