
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import AppointmentBookingSection from "@/components/patient/AppointmentBookingSection";

const PatientAppointments = () => {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <AppointmentBookingSection />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientAppointments;
