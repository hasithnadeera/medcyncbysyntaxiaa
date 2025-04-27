import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient-signup" element={<PatientSignup />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-dashboard/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-dashboard/pharmacists" element={<PharmacistManagement />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-dashboard/profile" element={<PatientProfile />} />
          <Route path="/patient-dashboard/medical-records" element={<PatientMedicalRecords />} />
          <Route path="/patient-dashboard/appointments" element={<PatientAppointments />} />
          <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
