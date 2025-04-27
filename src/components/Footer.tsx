
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10">
          <Link to="/contact" className="text-gray-600 hover:text-medsync-primary">
            Contact
          </Link>
          <Link to="/privacy" className="text-gray-600 hover:text-medsync-primary">
            Privacy Policy
          </Link>
          <span className="text-gray-600">©2025 MedSync</span>
        </nav>
      </div>
    </footer>
  );
}
