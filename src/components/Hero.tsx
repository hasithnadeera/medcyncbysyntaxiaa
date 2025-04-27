
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Health, Streamlined with MedSync
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience healthcare management reimagined. Seamlessly connect with doctors, 
            manage appointments, and access your medical information in one secure platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => navigate("/login")}
              className="bg-medsync-primary hover:bg-medsync-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
