import * as React from "react";
import { StudentDashboardView } from "@/components/screens/dashboard/student-dashboard-view";

export const metadata = {
  title: "Dashboard | HigherStudy",
  description: "Live overview of the reviewed HigherStudy catalogue.",
};

export const instant = false;

export default function DashboardPage() {
  return <StudentDashboardView />;
}
