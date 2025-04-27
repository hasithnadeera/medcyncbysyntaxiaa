
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
import PharmacistManagement from "./pages/PharmacistManagement";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import PatientAppointments from "./pages/PatientAppointments";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import { toast } from "sonner";

// Enhance the context to include user role
export const AuthContext = createContext<{ 
  user: User | null; 
  isLoading: boolean;
  userRole: string | null;
}>({
  user: null,
  isLoading: true,
  userRole: null,
});

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Fetch user role when auth state changes
        if (session?.user) {
          try {
            const { data, error } = await supabase.rpc('get_user_profile', { user_id: session.user.id });
            
            if (error) {
              console.error("Error fetching user role:", error);
            } else if (data && data.length > 0) {
              setUserRole(data[0].role);
            }
          } catch (error) {
            console.error("Error in role fetch:", error);
          }
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // Fetch user role for existing session
      if (session?.user) {
        try {
          const { data, error } = await supabase.rpc('get_user_profile', { user_id: session.user.id });
          
          if (error) {
            console.error("Error fetching user role:", error);
          } else if (data && data.length > 0) {
            setUserRole(data[0].role);
          }
        } catch (error) {
          console.error("Error in role fetch:", error);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced protected route component with role checking
  const ProtectedRoute = ({ 
    children, 
    requiredRole 
  }: { 
    children: React.ReactNode; 
    requiredRole?: string 
  }) => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    // Check if a specific role is required and if user has that role
    if (requiredRole && userRole !== requiredRole) {
      toast.error(`Access denied. This area is only for ${requiredRole}s.`);
      
      // Redirect to the appropriate dashboard based on user role
      if (userRole === 'patient') {
        return <Navigate to="/patient-dashboard" />;
      } else if (userRole === 'doctor') {
        return <Navigate to="/doctor-dashboard" />;
      } else if (userRole === 'pharmacist') {
        return <Navigate to="/pharmacist-dashboard" />;
      } else {
        return <Navigate to="/login" />;
      }
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading, userRole }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patient-signup" element={<PatientSignup />} />
              
              {/* Protected Routes with role requirements */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/appointments" element={
                <ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/pharmacists" element={
                <ProtectedRoute requiredRole="doctor"><PharmacistManagement /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard" element={
                <ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/profile" element={
                <ProtectedRoute requiredRole="patient"><PatientProfile /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/medical-records" element={
                <ProtectedRoute requiredRole="patient"><PatientMedicalRecords /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/appointments" element={
                <ProtectedRoute requiredRole="patient"><PatientAppointments /></ProtectedRoute>
              } />
              <Route path="/pharmacist-dashboard" element={
                <ProtectedRoute requiredRole="pharmacist"><PharmacistDashboard /></ProtectedRoute>
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
