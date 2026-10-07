"use client";

import * as React from "react";
import {
  X,
  Download,
  Pencil,
  Info,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  FileCheck2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { ApplicationItem } from "./application-types";

interface ApplicationDetailsModalProps {
  application: ApplicationItem;
  onClose: () => void;
  onEdit?: (app: ApplicationItem) => void;
}

export function ApplicationDetailsModal({
  application,
  onClose,
  onEdit,
}: ApplicationDetailsModalProps) {
  const checklistItems = application.checklist || [
    { task: "Create Account", status: "Completed", date: "Nov 15, 2024" },
    { task: "Personal Information", status: "Completed", date: "Nov 15, 2024" },
    { task: "Academic History", status: "Completed", date: "Nov 16, 2024" },
    { task: "Test Scores", status: "Completed", date: "Nov 16, 2024" },
    { task: "Statement of Purpose", status: "Completed", date: "Nov 20, 2024" },
    { task: "LOR 1", status: "Completed", date: "Nov 18, 2024" },
    { task: "LOR 2", status: "Pending" },
    { task: "CV/Resume", status: "Pending" },
    { task: "Review & Submit", status: "Pending" },
  ];

  const progressPercent = application.progressPercent ?? 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[960px] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header matching Figma Screen 10 */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your application status and progress details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(application)}
              className="h-10 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Application</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (2 Columns Split) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Application Details */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5 text-left">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Application Details
              </h3>

              <div className="space-y-4 text-xs divide-y divide-slate-100">
                {/* Status */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Info className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Application Status</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1E40AF]">
                    {application.status}
                  </span>
                </div>

                {/* Intake */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Intake</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {application.intake}
                  </span>
                </div>

                {/* Deadline */}
                <div className="flex items-start justify-between pt-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Deadline</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 block">
                      {application.deadline || "Dec 15, 2024"}
                    </span>
                    <span className="text-[11px] text-[#B45309] font-medium">
                      (30 days left)
                    </span>
                  </div>
                </div>

                {/* Program */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Program</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {application.program}
                  </span>
                </div>

                {/* Department */}
                <div className="flex items-start justify-between pt-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Department</span>
                  </div>
                  <span className="font-semibold text-slate-900 text-right max-w-[180px]">
                    {application.department ||
                      "Electrical Engineering & Computer Science"}
                  </span>
                </div>

                {/* Application ID */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileCheck2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Application ID</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {application.applicationId || "MIT-F25-EECS-1024"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Progress + Checklist */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top: Progress Bar Box */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Application Progress
                  </h3>
                  <span className="text-base font-bold text-[#0284C7]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0284C7] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Bottom: Checklist Box */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
                <h3 className="text-base font-bold text-slate-900 font-heading pb-1 border-b border-slate-100">
                  Checklist
                </h3>

                <div className="space-y-3.5 text-xs">
                  {checklistItems.map((item) => (
                    <div
                      key={item.task}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "Completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800">
                          {item.task}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <span
                          className={`font-semibold ${
                            item.status === "Completed"
                              ? "text-[#16A34A]"
                              : "text-[#B45309]"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.date && (
                          <span className="text-slate-400 min-w-[70px]">
                            {item.date}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
