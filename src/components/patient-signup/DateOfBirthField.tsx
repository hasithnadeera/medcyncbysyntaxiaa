
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { PatientSignupForm } from "@/lib/schemas/patient-signup-schema";
import { useState } from "react";

interface DateOfBirthFieldProps {
  form: UseFormReturn<PatientSignupForm>;
}

export function DateOfBirthField({ form }: DateOfBirthFieldProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const today = new Date();
  const minYear = 1900;
  const maxYear = today.getFullYear();

  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of Birth</FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setIsPopoverOpen(true)}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(selectedDate) => {
                  field.onChange(selectedDate);
                  setIsPopoverOpen(false);
                }}
                initialFocus
                disabled={(date) =>
                  date > today || date < new Date(minYear, 0, 1)
                }
                className={cn("p-3 pointer-events-auto")}
                classNames={{
                  caption_label: "text-sm font-medium cursor-pointer hover:bg-accent rounded-md p-1",
                  caption_dropdowns: "flex justify-center gap-1",
                  dropdown: "focus:outline-none focus:ring-2 focus:ring-accent",
                  dropdown_month: "relative inline-flex h-8",
                  dropdown_year: "relative inline-flex h-8",
                  dropdown_icon: "hidden" // Hide default dropdown icons
                }}
                captionLayout="dropdown"
                fromYear={minYear}
                toYear={maxYear}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
