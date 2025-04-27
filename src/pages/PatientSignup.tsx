
import { PatientSignupForm } from "@/components/patient-signup/PatientSignupForm";
import { Link } from "react-router-dom";

const PatientSignup = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <img 
            src="https://img.playbook.com/FreYCFlPY6LTRuNb4jErz3lhmTHkos8Iymufb10FfP4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzYzYWQxZmU2/LTgyNDQtNGQ2Zi1h/OTk1LWI3NzJmOGI2/OTc2ZA" 
            alt="MedSync Logo" 
            className="mx-auto h-16 w-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-900">Patient Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in your details to create an account
          </p>
        </div>
        <PatientSignupForm />
        <div className="mt-4 text-center">
          <Link 
            to="/login" 
            className="text-sm text-medsync-primary hover:text-medsync-primary/90"
          >
            Already registered? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
