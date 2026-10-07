import * as React from "react";
import { Suspense } from "react";
import { DashboardSidebar, DashboardHeader } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9FE] flex text-slate-900">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Suspense fallback={<div className="w-64 bg-white border-r border-slate-100 h-screen" />}>
          <DashboardSidebar />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div className="h-20 bg-white border-b border-slate-100" />}>
          <DashboardHeader />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
