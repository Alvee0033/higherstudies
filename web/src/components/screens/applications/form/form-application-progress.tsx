"use client";

import * as React from "react";
import { Flag, ChevronDown } from "lucide-react";
import {
  FormStatusStepper,
  ApplicationProgressStage,
} from "./form-status-stepper";

interface FormApplicationProgressProps {
  currentStage: ApplicationProgressStage;
  onChangeStage: (stage: ApplicationProgressStage) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function FormApplicationProgress({
  currentStage,
  onChangeStage,
  notes,
  setNotes,
}: FormApplicationProgressProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5 text-left">
      <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
        <Flag className="h-4 w-4" />
        <span>3. Application Progress</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Current Status Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Current Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={currentStage}
              onChange={(e) =>
                onChangeStage(e.target.value as ApplicationProgressStage)
              }
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="Not Started">Not Started</option>
              <option value="Preparing">Preparing</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview">Interview</option>
              <option value="Decision">Decision</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Progress Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Progress Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your application progress..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] resize-none"
          />
        </div>
      </div>

      {/* The 8-Stage Progress Tracker Stepper matching Figma Screen 11 */}
      <div className="pt-2 border-t border-slate-100">
        <FormStatusStepper
          currentStage={currentStage}
          onChange={onChangeStage}
        />
      </div>
    </div>
  );
}
