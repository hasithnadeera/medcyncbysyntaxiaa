
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

interface DateOfBirthFieldProps {
  form: UseFormReturn<PatientSignupForm>;
}

export function DateOfBirthField({ form }: DateOfBirthFieldProps) {
  const today = new Date().toISOString().split('T')[0];
  const minDate = "1900-01-01";

  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of Birth</FormLabel>
          <FormControl>
            <Input
              type="date"
              className="w-full"
              min={minDate}
              max={today}
              value={field.value instanceof Date && !isNaN(field.value.getTime()) 
                ? field.value.toISOString().split('T')[0] 
                : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  // Set the time to noon to avoid timezone issues
                  date.setHours(12, 0, 0, 0);
                  field.onChange(date);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
