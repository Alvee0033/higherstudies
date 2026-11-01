import { Suspense } from "react";
import { ProfessorListView } from "@/components/screens/professors/professor-list-view";

export const metadata = {
  title: "Faculty Directory | HigherStudy",
  description: "Search published faculty profiles, research areas, and institutional contact information.",
};

export const instant = false;

export default function ProfessorsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading professors...</div>}>
      <ProfessorListView />
    </Suspense>
  );
}
