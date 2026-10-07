import * as React from "react";
import { EmailTrackerView } from "@/components/screens/email-tracker/email-tracker-view";

export const metadata = {
  title: "Professor Mailing Tracker | HigherStudy",
  description: "Track your cold emails, reminder schedules, and professor responses in one place.",
};

export default function EmailTrackerPage() {
  return <EmailTrackerView />;
}
