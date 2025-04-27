
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Login Page Coming Soon</h1>
        <div className="space-y-2">
          <Link to="/" className="block text-medsync-primary hover:text-medsync-primary/90">
            Return to Home
          </Link>
          <Link to="/patient-signup" className="block text-medsync-primary hover:text-medsync-primary/90">
            Sign Up as Patient
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
