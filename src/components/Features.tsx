
const features = [
  {
    title: "Doctor Dashboard",
    description: "Comprehensive overview of patient histories, appointments, and medical records.",
  },
  {
    title: "Patient Appointments",
    description: "Easy scheduling and management of medical appointments with instant confirmations.",
  },
  {
    title: "Pharmacy Integration",
    description: "Seamless prescription management and direct communication with pharmacies.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Feature Highlights</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage your healthcare journey
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative flex flex-col p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
