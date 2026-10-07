"use client";

import * as React from "react";
import Link from "next/link";
import {
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
  ArrowLeft,
  X,
} from "lucide-react";

export function ApplicationDetailsView({ id }: { id?: string }) {
  const application = {
    id: id || "1",
    university: "Massachusetts Institute of Technology (MIT)",
    program: "PhD in EECS",
    department: "Electrical Engineering & Computer Science",
    status: "Preparing",
    intake: "Fall 2025",
    deadline: "Dec 15, 2024",
    daysLeft: 30,
    applicationId: "MIT-F25-EECS-1024",
    progressPercent: 60,
    checklist: [
      { task: "Create Account", status: "Completed", date: "Nov 15, 2024" },
      { task: "Personal Information", status: "Completed", date: "Nov 15, 2024" },
      { task: "Academic History", status: "Completed", date: "Nov 16, 2024" },
      { task: "Test Scores", status: "Completed", date: "Nov 16, 2024" },
      { task: "Statement of Purpose", status: "Completed", date: "Nov 20, 2024" },
      { task: "LOR 1", status: "Completed", date: "Nov 18, 2024" },
      { task: "LOR 2", status: "Pending" },
      { task: "CV/Resume", status: "Pending" },
      { task: "Review & Submit", status: "Pending" },
    ],
  };

  const handleDownloadPdf = () => {
    alert("Downloading Application Summary PDF...");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-left">
      {/* Top Header matching Figma Screen 10 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/applications"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 -ml-1 rounded-lg"
              title="Back to Applications"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Overview
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 pl-6 sm:pl-7">
            Review your application status and progress details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Download PDF</span>
          </button>

          <Link
            href="/applications"
            className="h-10 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Application</span>
          </Link>

          <Link
            href="/applications"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Details Layout matching Figma Screen 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Application Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 text-left">
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Application Details
          </h2>

          <div className="space-y-4 text-xs divide-y divide-slate-100">
            {/* Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-slate-500">
                <Info className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Application Status</span>
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E8F0FE] text-[#1967D2]">
                {application.status}
              </span>
            </div>

            {/* Intake */}
            <div className="flex items-center justify-between pt-3.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Intake</span>
              </div>
              <span className="font-semibold text-slate-900">
                {application.intake}
              </span>
            </div>

            {/* Deadline */}
            <div className="flex items-start justify-between pt-3.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Deadline</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 block">
                  {application.deadline}
                </span>
                <span className="text-[11px] text-[#B45309] font-medium">
                  ({application.daysLeft} days left)
                </span>
              </div>
            </div>

            {/* Program */}
            <div className="flex items-center justify-between pt-3.5">
              <div className="flex items-center gap-2 text-slate-500">
                <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Program</span>
              </div>
              <span className="font-semibold text-slate-900">
                {application.program}
              </span>
            </div>

            {/* Department */}
            <div className="flex items-start justify-between pt-3.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Department</span>
              </div>
              <span className="font-semibold text-slate-900 text-right max-w-[200px]">
                {application.department}
              </span>
            </div>

            {/* Application ID */}
            <div className="flex items-center justify-between pt-3.5">
              <div className="flex items-center gap-2 text-slate-500">
                <FileCheck2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Application ID</span>
              </div>
              <span className="font-semibold text-slate-900">
                {application.applicationId}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Application Progress
              </h2>
              <span className="text-base font-bold text-[#0052CC]">
                {application.progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#0052CC] rounded-full transition-all duration-300"
                style={{ width: `${application.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-left">
            <h2 className="text-base font-bold text-slate-900 font-heading pb-2 border-b border-slate-100">
              Checklist
            </h2>

            <div className="space-y-3.5 text-xs">
              {application.checklist.map((item) => (
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
                      <span className="text-slate-400 min-w-[75px]">
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
  );
}
