import { Metadata } from "next";
import { SettingsView } from "@/components/screens/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings | HigherStudy",
  description: "Manage your account, notification preferences, security, and subscription.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
