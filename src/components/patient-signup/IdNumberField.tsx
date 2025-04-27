
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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const key = e.key.toLowerCase();

    // Allow backspace, delete, arrow keys
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key.startsWith('Arrow')) {
      return;
    }

    // For 9-digit format: only allow 'v' at the end if length is 9
    if (value.length === 9 && key === 'v') {
      return;
    }

    // For both formats: only allow digits if under max length
    if (!/^\d$/.test(key) || 
        (value.length >= 12) || 
        (value.length === 9 && !/v/i.test(key))) {
      e.preventDefault();
    }
  };

  return (
    <FormField
      control={form.control}
      name="idNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ID Number</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your ID number" 
              {...field}
              onKeyPress={handleKeyPress}
              maxLength={12}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
