import { Suspense } from "react";
import { UniversitiesExplorerView } from "@/components/screens/universities/universities-explorer-view";

export const metadata = {
  title: "Universities Explorer | HigherStudy",
  description: "Discover universities and graduate programmes that match your academic profile and preferences.",
};

export const instant = false;

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading universities...</div>}>
      <UniversitiesExplorerView />
    </Suspense>
  );
}
