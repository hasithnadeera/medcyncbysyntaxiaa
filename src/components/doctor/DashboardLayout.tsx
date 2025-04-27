
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarInset className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center h-16 px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-medium">Doctor Dashboard</h1>
        </div>
      </div>
      <main className="p-6">
        {children}
      </main>
    </SidebarInset>
  );
};

export default DashboardLayout;
