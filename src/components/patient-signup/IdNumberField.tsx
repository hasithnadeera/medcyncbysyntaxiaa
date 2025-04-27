
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PatientSignupForm } from "@/lib/schemas/patient-signup-schema";

interface IdNumberFieldProps {
  form: UseFormReturn<PatientSignupForm>;
}

export function IdNumberField({ form }: IdNumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name="idNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ID Number</FormLabel>
          <FormControl>
            <Input placeholder="Enter your ID number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

