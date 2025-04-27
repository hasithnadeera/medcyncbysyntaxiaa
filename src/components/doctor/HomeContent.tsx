
import { AppointmentsList } from "./AppointmentsList";

const HomeContent = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
        <AppointmentsList />
      </section>
    </div>
  );
};

export default HomeContent;
