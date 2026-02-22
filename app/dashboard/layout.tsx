import { Sidebar } from "@/src/modules/home/component/navbar";

// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* This renders the Mobile Header on small screens and Sidebar on large */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}