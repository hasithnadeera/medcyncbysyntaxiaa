
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

export function PatientSignupForm() {
  const form = useForm<PatientSignupFormType>({
    resolver: zodResolver(patientSignupSchema),
    defaultValues: {
      name: "",
      address: "",
      idNumber: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: PatientSignupFormType) => {
    console.log(values);
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
        <Button type="submit" className="w-full bg-medsync-primary">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}

