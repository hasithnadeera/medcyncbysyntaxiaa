
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PatientSignup from "./pages/PatientSignup";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorSearchPatients from "./pages/DoctorSearchPatients";
import PharmacistManagement from "./pages/PharmacistManagement";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import PatientAppointments from "./pages/PatientAppointments";
import PharmacistDashboard from "./pages/PharmacistDashboard";

// Create a context for user authentication
export const AuthContext = createContext<{ user: User | null; isLoading: boolean }>({
  user: null,
  isLoading: true,
});

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Create a protected route component
  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    // For routes that require a specific role, we would need to check user role here
    // This is left as an enhancement for later
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patient-signup" element={<PatientSignup />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute><DoctorDashboard /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/appointments" element={
                <ProtectedRoute><DoctorAppointments /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/search" element={
                <ProtectedRoute><DoctorSearchPatients /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/pharmacists" element={
                <ProtectedRoute><PharmacistManagement /></ProtectedRoute>
              } />
              
              {/* Patient Routes */}
              <Route path="/patient-dashboard" element={
                <ProtectedRoute><PatientDashboard /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/profile" element={
                <ProtectedRoute><PatientProfile /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/medical-records" element={
                <ProtectedRoute><PatientMedicalRecords /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/appointments" element={
                <ProtectedRoute><PatientAppointments /></ProtectedRoute>
              } />
              
              {/* Pharmacist Routes */}
              <Route path="/pharmacist-dashboard" element={
                <ProtectedRoute><PharmacistDashboard /></ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
