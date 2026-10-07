"use client";

import * as React from "react";
import { Calendar } from "lucide-react";

interface FormImportantDatesProps {
  appDate: string;
  setAppDate: (val: string) => void;
  deadline: string;
  setDeadline: (val: string) => void;
  decisionDate: string;
  setDecisionDate: (val: string) => void;
  enrollmentDate: string;
  setEnrollmentDate: (val: string) => void;
}

export function FormImportantDates({
  appDate,
  setAppDate,
  deadline,
  setDeadline,
  decisionDate,
  setDecisionDate,
  enrollmentDate,
  setEnrollmentDate,
}: FormImportantDatesProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
        <Calendar className="h-4 w-4" />
        <span>2. Important Dates</span>
      </div>

      {/* Row 1: Application Date & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Application Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={appDate}
              onChange={(e) => setAppDate(e.target.value)}
              placeholder="Select date"
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
            <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Select date"
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
            <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Expected Decision Date & Enrollment Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Expected Decision Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={decisionDate}
              onChange={(e) => setDecisionDate(e.target.value)}
              placeholder="Select date"
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
            <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Enrollment / Start Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
              placeholder="Select date"
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
            <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
