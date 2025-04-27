
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto pt-20 pb-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="text-left max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Health, Streamlined with MedSync
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience healthcare management reimagined. Seamlessly connect with doctors, 
              manage appointments, and access your medical information in one secure platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                onClick={() => navigate("/login")}
                className="bg-medsync-primary hover:bg-medsync-primary/90"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/patient-signup")}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare Professional"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
