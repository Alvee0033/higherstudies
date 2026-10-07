import * as React from "react";
import { StudentDashboardView } from "@/components/screens/dashboard/student-dashboard-view";

export const metadata = {
  title: "Dashboard | HigherStudy",
  description: "Overview of your universities, professors, emails, and applications.",
};

export default function DashboardPage() {
  return <StudentDashboardView />;
}
