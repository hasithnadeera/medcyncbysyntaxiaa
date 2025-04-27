
import { Milestone } from "@/components/Milestone";

const steps = [
  {
    title: "Create Account",
    description: "Sign up in minutes with your basic information and medical history.",
  },
  {
    title: "Connect with Providers",
    description: "Find and connect with healthcare providers in your network.",
  },
  {
    title: "Schedule Appointments",
    description: "Book appointments and receive reminders for upcoming visits.",
  },
  {
    title: "Manage Your Health",
    description: "Access records, prescriptions, and communicate with your care team.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Getting started with MedSync is easy
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Milestone
              key={step.title}
              number={index + 1}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
