
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

export function PatientSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      console.log("Form values:", values);
      
      // In a real application, you would send this data to your backend
      // For now, let's simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Show success message
      toast.success("Registration successful", {
        description: "Your account has been created successfully.",
      });
      
      // Navigate to login page or dashboard after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Registration failed", {
        description: "There was an error processing your registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
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
