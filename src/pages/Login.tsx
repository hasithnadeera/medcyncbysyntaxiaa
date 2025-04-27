
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        // Handle specific error cases
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        } else {
          throw signInError;
        }
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      // Fetch user role after successful authentication
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (userError) {
        console.error("Error fetching user data:", userError);
        toast.error("Login successful, but there was an issue retrieving your user profile.");
        navigate('/'); // Fallback to home page if role can't be determined
        return;
      }

      toast.success("Login successful!");

      // Route based on user role
      if (userData) {
        switch (userData.role) {
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          case 'patient':
            navigate('/patient-dashboard');
            break;
          case 'pharmacist':
            navigate('/pharmacist-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        // If userData is null (maybe user just registered and profile not created yet)
        toast.error("User profile not found. Please contact support.");
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message);
      toast.error("Login failed", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <img 
            src="https://img.playbook.com/FreYCFlPY6LTRuNb4jErz3lhmTHkos8Iymufb10FfP4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzYzYWQxZmU2/LTgyNDQtNGQ2Zi1h/OTk1LWI3NzJmOGI2/OTc2ZA" 
            alt="MedSync Logo" 
            className="mx-auto h-16 w-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-medsync-primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

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
