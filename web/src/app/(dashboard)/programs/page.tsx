import { Suspense } from "react";
import { ProgramsExplorerView } from "@/components/screens/programs/programs-explorer-view";

export const metadata = {
  title: "Graduate Programmes | HigherStudy",
  description: "Explore source-attributed Master's and PhD programmes, tuition details, deadlines, and admission requirements.",
};

export const instant = false;

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading programmes...</div>}>
      <ProgramsExplorerView />
    </Suspense>
  );
}
