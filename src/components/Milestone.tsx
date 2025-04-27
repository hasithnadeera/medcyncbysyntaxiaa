
interface MilestoneProps {
  number: number;
  title: string;
  description: string;
}

export function Milestone({ number, title, description }: MilestoneProps) {
  return (
    <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medsync-primary text-white text-xl font-semibold mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
