
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { PatientSignupForm } from "@/lib/schemas/patient-signup-schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface OTPVerificationProps {
  form: UseFormReturn<PatientSignupForm>;
  onVerificationComplete: () => void;
}

export function OTPVerification({ form, onVerificationComplete }: OTPVerificationProps) {
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");

  const requestOTP = async () => {
    try {
      setIsRequestingOTP(true);
      const phoneNumber = form.getValues("phoneNumber");

      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber }
      });

      if (error) throw error;

      setGeneratedOTP(data.otp);
      setShowOTPInput(true);
      toast.success("OTP sent successfully", {
        description: "Please check your phone for the verification code.",
      });
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Failed to send OTP", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const verifyOTP = async () => {
    setIsVerifying(true);
    try {
      if (otp === generatedOTP) {
        toast.success("Phone number verified successfully");
        onVerificationComplete();
      } else {
        toast.error("Invalid OTP", {
          description: "Please check the code and try again.",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Verification failed", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <div className="space-y-4">
            <FormControl>
              <Input
                placeholder="07XXXXXXXX"
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  field.onChange(value);
                }}
                disabled={showOTPInput}
              />
            </FormControl>
            <FormMessage />
            
            {!showOTPInput ? (
              <Button
                type="button"
                onClick={requestOTP}
                disabled={isRequestingOTP || !field.value || field.value.length !== 10}
              >
                {isRequestingOTP ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={verifyOTP}
                    disabled={isVerifying || otp.length !== 6}
                  >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOTPInput(false);
                      setOtp("");
                    }}
                  >
                    Change Number
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
