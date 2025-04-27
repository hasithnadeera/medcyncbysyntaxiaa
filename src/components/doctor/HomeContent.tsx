import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const HomeContent = () => {
  const navigate = useNavigate();
  return <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-medsync-primary">8</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Patients Seen Today</h3>
          <p className="text-3xl font-bold text-medsync-primary">5</p>
        </Card>
      </div>

      <div className="flex gap-4">
        
        
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div className="space-y-4">
          {/* Placeholder for appointments list */}
          <p className="text-gray-500">No appointments scheduled for today.</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Medical Record Form</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
              Patient ID
            </label>
            <input type="text" id="patientId" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="illness" className="block text-sm font-medium text-gray-700">
              Illness
            </label>
            <input type="text" id="illness" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
              Symptoms
            </label>
            <textarea id="symptoms" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
              Prescription
            </label>
            <textarea id="prescription" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea id="notes" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <Button type="submit" className="bg-medsync-primary">
            Save Record
          </Button>
        </form>
      </Card>
    </div>;
};
export default HomeContent;