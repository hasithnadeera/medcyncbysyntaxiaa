
import * as z from "zod";

export const patientSignupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  idNumber: z.string().refine(
    (value) => {
      const oldFormat = /^\d{9}[vV]$/;
      const newFormat = /^\d{12}$/;
      return oldFormat.test(value) || newFormat.test(value);
    },
    {
      message: "ID must be either 9 digits ending with 'v' (e.g., 690761122v) or 12 digits (e.g., 200227401352)",
    }
  ),
  address: z.string().min(1, {
    message: "Address is required.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  phoneNumber: z.string().regex(/^07\d{8}$/, {
    message: "Phone number must start with 07 and be exactly 10 digits.",
  }),
});

export type PatientSignupForm = z.infer<typeof patientSignupSchema>;

