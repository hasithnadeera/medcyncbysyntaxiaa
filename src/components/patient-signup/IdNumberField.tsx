
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

    // If trying to enter 'v' or 'V'
    if (key === 'v') {
      // Only allow 'v' at position 9 (after 9 digits)
      if (value.length !== 9) {
        e.preventDefault();
      }
      return;
    }

    // For both formats: only allow digits if under respective max length
    if (!/^\d$/.test(key)) {
      e.preventDefault();
    } else if (value.length >= 12 || (value.includes('v') || value.includes('V'))) {
      // Prevent entering more digits if already at max length (12) or if 'v' is already present
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
