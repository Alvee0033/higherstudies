import * as React from "react";
import { Suspense } from "react";
import { DashboardSidebar, DashboardHeader, ClientPageBanner } from "@/components/layout/dashboard-nav";

import { StudentSession } from "@/components/layout/student-session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentSession><div className="client-workspace min-h-screen flex text-slate-900">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Suspense fallback={<div className="w-56 bg-white h-screen" />}>
          <DashboardSidebar />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div className="h-16 bg-white" />}>
          <DashboardHeader />
        </Suspense>
        <main className="client-workspace-main flex-1 p-4 sm:p-5 lg:p-6 w-full">
          <ClientPageBanner />
          {children}
        </main>
      </div>
    </div></StudentSession>
  );
}
