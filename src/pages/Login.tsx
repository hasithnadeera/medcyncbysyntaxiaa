
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
      });
      return;
    }
    setShowOTP(true);
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the OTP",
    });
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {!showOTP ? (
          <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={phoneNumber.length !== 10}>
              Send OTP <Send className="ml-2" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={otp.length !== 6}>
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setShowOTP(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className="space-y-2 text-center">
          <Link
            to="/patient-signup"
            className="block text-sm text-medsync-primary hover:text-medsync-primary/90"
          >
            Don't have an account? Sign up
          </Link>
          <Link
            to="/"
            className="block text-sm text-medsync-primary hover:text-medsync-primary/90"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
