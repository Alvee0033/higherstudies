"use client";

import * as React from "react";
import { FileText, HelpCircle } from "lucide-react";

interface DocumentStatusState {
  transcript: "Not Submitted" | "Submitted";
  lor1: "Not Submitted" | "Submitted";
  lor2: "Not Submitted" | "Submitted";
  sop: "Not Submitted" | "Submitted";
  cv: "Not Submitted" | "Submitted";
}

export function FormAcademicDocuments() {
  const [docStatuses, setDocStatuses] = React.useState<DocumentStatusState>({
    transcript: "Submitted",
    lor1: "Submitted",
    lor2: "Submitted",
    sop: "Submitted",
    cv: "Submitted",
  });

  const toggleDoc = (key: keyof DocumentStatusState, status: "Not Submitted" | "Submitted") => {
    setDocStatuses((prev) => ({ ...prev, [key]: status }));
  };

  const docs: { key: keyof DocumentStatusState; label: string }[] = [
    { key: "transcript", label: "Official Transcript" },
    { key: "lor1", label: "LOR 1" },
    { key: "lor2", label: "LOR 2" },
    { key: "sop", label: "SOP / Personal Statement" },
    { key: "cv", label: "Resume / CV" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
        <FileText className="h-4 w-4" />
        <span>4. Academic Documents</span>
      </div>

      <div className="space-y-3.5 divide-y divide-slate-100">
        {docs.map((doc, idx) => {
          const isSubmitted = docStatuses[doc.key] === "Submitted";

          return (
            <div
              key={doc.key}
              className={`flex items-center justify-between gap-4 ${
                idx > 0 ? "pt-3.5" : ""
              }`}
            >
              {/* Document Label with Info Tooltip */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                <span>{doc.label}</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
              </div>

              {/* Segmented Radio Capsule matching Figma Screen 11 */}
              <div className="flex items-center gap-2 bg-slate-50/80 p-1 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleDoc(doc.key, "Not Submitted")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    !isSubmitted
                      ? "bg-white text-slate-800 font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      !isSubmitted ? "border-slate-500" : "border-slate-300"
                    }`}
                  >
                    {!isSubmitted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    )}
                  </span>
                  <span>Not Submitted</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleDoc(doc.key, "Submitted")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSubmitted
                      ? "bg-[#ECFDF5] text-[#15803D] font-semibold border border-emerald-200/60"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSubmitted ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                    }`}
                  >
                    {isSubmitted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span>Submitted</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
