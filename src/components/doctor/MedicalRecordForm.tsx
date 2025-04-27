
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
import { FilePen, Clipboard } from "lucide-react";

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
  const [patientName, setPatientName] = useState<string | null>(null);
  
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

  const patientId = form.watch("patientId");

  // Fetch patient name when ID changes
  const verifyPatient = async () => {
    if (!patientId || patientId.length < 30) return; // Basic UUID validation
    
    try {
      // Use direct query instead of requiring role='patient'
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', patientId)
        .single();
        
      if (error || !data) {
        setPatientName(null);
        toast.error("Patient not found. Please check the Patient ID");
        return;
      }
      
      setPatientName(data.name);
      toast.success(`Patient verified: ${data.name}`);
    } catch (error) {
      console.error("Error verifying patient:", error);
      setPatientName(null);
      toast.error("Error verifying patient");
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue("patientId", text);
      verifyPatient();
    } catch (err) {
      toast.error("Failed to read from clipboard");
    }
  };

  async function onSubmit(data: MedicalRecordFormValues) {
    setIsSubmitting(true);
    
    try {
      // First, verify patient exists - remove role check
      const { data: patientData, error: patientError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.patientId)
        .single();
        
      if (patientError || !patientData) {
        toast.error("Patient not found. Please check the Patient ID");
        setIsSubmitting(false);
        return;
      }
      
      // Create medical record - this will trigger the prescription creation
      const { error: recordError } = await supabase
        .from('medical_records')
        .insert({
          patient_id: data.patientId,
          illness: data.illness,
          symptoms: data.symptoms,
          prescription: data.prescription,
          notes: data.notes
        });
        
      if (recordError) {
        console.error("Error creating medical record:", recordError);
        toast.error("Failed to create medical record");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Medical record created successfully");
      toast.info("Prescription has been sent to pharmacy");
      form.reset();
      setPatientName(null);
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
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder="Enter patient ID" 
                    {...field} 
                    onBlur={verifyPatient}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePasteFromClipboard}
                  title="Paste from clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              {patientName && (
                <p className="text-sm text-green-600 mt-1">
                  Patient: {patientName}
                </p>
              )}
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
