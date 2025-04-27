
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
                  caption: "flex justify-center pt-1 relative items-center gap-1",
                  caption_label: "text-sm font-medium",
                  caption_dropdowns: "flex justify-center gap-2",
                  dropdown: "p-2 bg-white rounded-md border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm",
                  dropdown_month: "relative inline-flex h-9",
                  dropdown_year: "relative inline-flex h-9",
                  dropdown_icon: "hidden",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm relative p-0 hover:bg-accent rounded-md",
                  day: "h-9 w-9 p-0 font-normal hover:bg-accent rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
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

