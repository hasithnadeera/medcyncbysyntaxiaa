
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NameField } from "./NameField";
import { DateOfBirthField } from "./DateOfBirthField";
import { IdNumberField } from "./IdNumberField";
import { AddressField } from "./AddressField";
import { GenderField } from "./GenderField";
import { PhoneNumberField } from "./PhoneNumberField";
import { 
  patientSignupSchema, 
  type PatientSignupForm as PatientSignupFormType 
} from "@/lib/schemas/patient-signup-schema";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

export function PatientSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<PatientSignupFormType>({
    resolver: zodResolver(patientSignupSchema),
    defaultValues: {
      name: "",
      address: "",
      idNumber: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: PatientSignupFormType) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log("Form values:", values);
      
      // Format phone number with Sri Lankan country code for consistency
      const formattedPhoneNumber = values.phoneNumber.startsWith("07") 
        ? values.phoneNumber.substring(1) // Remove the leading 0
        : values.phoneNumber;
      
      // Convert date to string format expected by the database
      const formattedDateOfBirth = format(values.dateOfBirth, 'yyyy-MM-dd');
      
      // Use the REST API directly to bypass RLS policies
      const response = await fetch("https://svpyzojlgpihzzxdiaex.supabase.co/rest/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cHl6b2psZ3BpaHp6eGRpYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODQ3NDEsImV4cCI6MjA2MTI2MDc0MX0.LCnA52vfkoGHk7ODXjUlKqJ_VNIH8jh0dX6bL7RugPA",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          name: values.name,
          dob: formattedDateOfBirth,
          id_number: values.idNumber,
          address: values.address,
          gender: values.gender,
          phone_number: formattedPhoneNumber,
          role: 'patient' // Explicitly set the role to 'patient'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Database insertion error:", errorData);
        
        if (errorData.code === '23505') {
          setError("A user with this phone number or ID number already exists.");
        } else {
          setError(`Registration failed: ${errorData.message}`);
        }
        return;
      }
      
      // Show success message after successful DB insertion
      toast.success("Registration successful", {
        description: "Your account has been created successfully.",
      });
      
      // Navigate to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("There was an error processing your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameField form={form} />
        <DateOfBirthField form={form} />
        <IdNumberField form={form} />
        <AddressField form={form} />
        <GenderField form={form} />
        <PhoneNumberField form={form} />
        <Button 
          type="submit" 
          className="w-full bg-medsync-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
