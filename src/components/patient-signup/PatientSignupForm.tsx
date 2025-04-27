
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NameField } from "./NameField";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
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
      email: "",
      password: "",
      address: "",
      idNumber: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: PatientSignupFormType) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format phone number and date for consistency
      const formattedPhoneNumber = values.phoneNumber.startsWith("07") 
        ? values.phoneNumber
        : "0" + values.phoneNumber;
      
      const formattedDateOfBirth = format(values.dateOfBirth, 'yyyy-MM-dd');
      
      // First check if user already exists in auth system
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', values.email)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking for existing user:", checkError);
        throw new Error("Error checking user existence. Please try again.");
      }
      
      if (existingUser) {
        throw new Error("A user with this email already exists. Please try logging in instead.");
      }
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        // Check if it's the "User already registered" error
        if (authError.message.includes("User already registered")) {
          throw new Error("This email is already registered. Please try logging in instead.");
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Insert user profile data
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: values.name,
          email: values.email,
          dob: formattedDateOfBirth,
          id_number: values.idNumber,
          address: values.address,
          gender: values.gender,
          phone_number: formattedPhoneNumber,
          role: 'patient'
        });
      
      if (insertError) {
        console.error("Error inserting user data:", insertError);
        
        // If inserting fails, we should cleanup the auth user to avoid orphaned auth accounts
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        throw new Error("Failed to create user profile. Please try again.");
      }
      
      toast.success("Registration successful", {
        description: "Your account has been created. Please check your email for verification.",
      });
      
      navigate("/login");
      
    } catch (error: any) {
      console.error("Error during form submission:", error);
      setError(error.message || "Failed to create account. Please try again.");
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
        <EmailField form={form} />
        <PasswordField form={form} />
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
