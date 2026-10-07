import * as React from "react";
import { UniversitiesExplorerView } from "@/components/screens/universities/universities-explorer-view";

export const metadata = {
  title: "Universities Explorer | HigherStudy",
  description: "Discover universities that match your academic profile and preferences.",
};

export default function UniversitiesPage() {
  return <UniversitiesExplorerView />;
}
