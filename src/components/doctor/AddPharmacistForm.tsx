import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const pharmacistFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  idNumber: z.string().min(1, "ID Number is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(/^07\d{8}$/, {
    message: "Phone number must start with 07 and be exactly 10 digits.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type PharmacistFormValues = z.infer<typeof pharmacistFormSchema>;

export function AddPharmacistForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PharmacistFormValues>({
    resolver: zodResolver(pharmacistFormSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      gender: undefined,
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: PharmacistFormValues) {
    setIsSubmitting(true);
    
    try {
      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) {
        console.error("Error creating user account:", authError);
        toast.error("Failed to create account: " + authError.message);
        setIsSubmitting(false);
        return;
      }
      
      if (!authData.user) {
        toast.error("Failed to create account");
        setIsSubmitting(false);
        return;
      }
      
      // Then, create pharmacist profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        id_number: data.idNumber,
        dob: data.dateOfBirth,
        address: data.address,
        phone_number: data.phone,
        gender: data.gender,
        role: "pharmacist",
      });
      
      if (profileError) {
        console.error("Error creating pharmacist profile:", profileError);
        toast.error("Failed to create pharmacist profile");
        
        // Try to clean up the auth user if profile creation failed
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Pharmacist registered successfully!");
      form.reset();
      
      // Close the dialog using the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter ID number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="07XXXXXXXX" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Male
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Female
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            className="bg-medsync-primary hover:bg-medsync-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Pharmacist"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
