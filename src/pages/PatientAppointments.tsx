
import React from "react";
import PatientDashboardLayout from "@/components/patient/PatientDashboardLayout";
import AppointmentBookingSection from "@/components/patient/AppointmentBookingSection";
import AppointmentsList from "@/components/patient/AppointmentsList";

const PatientAppointments = () => {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <AppointmentsList />
        <h2 className="text-xl font-semibold mt-8">Book New Appointment</h2>
        <AppointmentBookingSection />
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientAppointments;
