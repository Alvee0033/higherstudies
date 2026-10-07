"use client";

import * as React from "react";

export type ApplicationProgressStage =
  | "Not Started"
  | "Preparing"
  | "Submitted"
  | "Under Review"
  | "Interview"
  | "Decision"
  | "Accepted"
  | "Rejected";

interface FormStatusStepperProps {
  currentStage: ApplicationProgressStage;
  onChange: (stage: ApplicationProgressStage) => void;
}

const STAGES: { stage: ApplicationProgressStage; label: string; ringColor?: string }[] = [
  { stage: "Not Started", label: "Not Started", ringColor: "border-[#4F46E5] text-[#4F46E5]" },
  { stage: "Preparing", label: "Preparing" },
  { stage: "Submitted", label: "Submitted" },
  { stage: "Under Review", label: "Under Review" },
  { stage: "Interview", label: "Interview" },
  { stage: "Decision", label: "Decision" },
  { stage: "Accepted", label: "Accepted", ringColor: "border-emerald-500 text-emerald-600" },
  { stage: "Rejected", label: "Rejected", ringColor: "border-rose-500 text-rose-500" },
];

export function FormStatusStepper({
  currentStage,
  onChange,
}: FormStatusStepperProps) {
  return (
    <div className="relative pt-4 pb-2">
      {/* Connecting horizontal line */}
      <div className="absolute top-[26px] left-6 right-6 h-0.5 bg-slate-200 -z-0" />

      {/* 8 Circles and Labels Grid */}
      <div className="grid grid-cols-8 gap-1 relative z-10 text-center">
        {STAGES.map((s) => {
          const isSelected = currentStage === s.stage;

          return (
            <div
              key={s.stage}
              onClick={() => onChange(s.stage)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Circle Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white ${
                  isSelected
                    ? "border-2 border-[#4F46E5] ring-2 ring-[#4F46E5]/20"
                    : s.stage === "Accepted"
                    ? "border-2 border-emerald-500"
                    : s.stage === "Rejected"
                    ? "border-2 border-rose-500"
                    : "border-2 border-slate-300 group-hover:border-slate-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] mt-2 transition-colors font-medium leading-tight select-none ${
                  isSelected
                    ? "text-slate-900 font-bold"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
