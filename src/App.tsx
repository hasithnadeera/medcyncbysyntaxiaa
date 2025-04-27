import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
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

export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  role: string | null;
}>({
  user: null,
  isLoading: true,
  role: null,
});

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('get_user_profile', {
          user_id: userId
        });
        
        if (error) {
          console.error("Error fetching user profile:", error);
          return null;
        }

        if (data && data.length > 0) {
          return data[0].role;
        }
        return null;
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const userRole = await fetchUserRole(session.user.id);
          setRole(userRole);
        } else {
          setRole(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ProtectedRoute = ({ 
    children, 
    allowedRoles 
  }: { 
    children: React.ReactNode; 
    allowedRoles: string[];
  }) => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
      toast.error("Please log in to access this page");
      return <Navigate to="/login" />;
    }

    if (!role || !allowedRoles.includes(role)) {
      toast.error("You don't have permission to access this page");
      
      if (role === 'patient') {
        return <Navigate to="/patient-dashboard" />;
      } else if (role === 'doctor') {
        return <Navigate to="/doctor-dashboard" />;
      } else if (role === 'pharmacist') {
        return <Navigate to="/pharmacist-dashboard" />;
      } else {
        return <Navigate to="/login" />;
      }
    }
    
    return <>{children}</>;
  };

  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (user && role) {
      if (role === 'patient') {
        return <Navigate to="/patient-dashboard" />;
      } else if (role === 'doctor') {
        return <Navigate to="/doctor-dashboard" />;
      } else if (role === 'pharmacist') {
        return <Navigate to="/pharmacist-dashboard" />;
      }
    }

    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading, role }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={
                <AuthRoute><Login /></AuthRoute>
              } />
              <Route path="/patient-signup" element={
                <AuthRoute><PatientSignup /></AuthRoute>
              } />
              
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/appointments" element={
                <ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/pharmacists" element={
                <ProtectedRoute allowedRoles={['doctor']}><PharmacistManagement /></ProtectedRoute>
              } />
              
              <Route path="/patient-dashboard" element={
                <ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/profile" element={
                <ProtectedRoute allowedRoles={['patient']}><PatientProfile /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/medical-records" element={
                <ProtectedRoute allowedRoles={['patient']}><PatientMedicalRecords /></ProtectedRoute>
              } />
              <Route path="/patient-dashboard/appointments" element={
                <ProtectedRoute allowedRoles={['patient']}><PatientAppointments /></ProtectedRoute>
              } />
              
              <Route path="/pharmacist-dashboard" element={
                <ProtectedRoute allowedRoles={['pharmacist']}><PharmacistDashboard /></ProtectedRoute>
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
