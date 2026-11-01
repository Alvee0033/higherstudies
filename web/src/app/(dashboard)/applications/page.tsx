import * as React from "react";
import { ApplicationTrackerView } from "@/components/screens/applications/application-tracker-view";

export const metadata = {
  title: "Application Tracker | HigherStudy",
  description: "Track and manage your university applications in one Kanban pipeline.",
};

export const instant = false;

export default function ApplicationsPage() {
  return <ApplicationTrackerView />;
}
