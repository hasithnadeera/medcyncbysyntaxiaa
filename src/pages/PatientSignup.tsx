
import { PatientSignupForm } from "@/components/patient-signup/PatientSignupForm";

const PatientSignup = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Patient Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in your details to create an account
          </p>
        </div>
        <PatientSignupForm />
      </div>
    </div>
  );
};

export default PatientSignup;

