"use client";

import * as React from "react";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  Undo2,
  Calendar,
  Pencil,
  FileText,
  Download,
} from "lucide-react";
import { EmailRecord } from "./email-tracker-types";

interface EmailTrackerDetailViewProps {
  record: EmailRecord;
}

export function EmailTrackerDetailView({ record }: EmailTrackerDetailViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-[960px] mx-auto text-left">
      <h2 className="text-2xl font-bold text-slate-900 font-heading mb-6">
        Detailed View
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Professor Card + Timeline) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Professor Bio Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-2xs">
                <Image
                  src={record.avatar}
                  alt={record.professorName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {record.professorName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {record.professorTitle === "Professor of CS"
                    ? "Professor of Computer Science"
                    : record.professorTitle}
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
                    {record.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  {record.universityName} {record.universitySub}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{record.location || "Stanford, CA, USA"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${record.email}`}
                  className="text-[#4F46E5] hover:underline truncate"
                >
                  {record.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <a
                  href={record.website || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4F46E5] hover:underline truncate"
                >
                  {record.website || `https://cs.stanford.edu/~jsmith`}
                </a>
              </div>
            </div>
          </div>

          {/* Email Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Email Timeline
            </h4>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Initial Email Sent */}
              <div className="relative">
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A34A] ring-2 ring-white">
                  <CheckCircle2 className="h-5 w-5 fill-[#DCFCE7]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Initial Email Sent
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.sentDate} at {record.sentTime}
                  </p>
                </div>
              </div>

              {/* Step 2: Reminder 1 Sent */}
              <div className="relative">
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A34A] ring-2 ring-white">
                  <CheckCircle2 className="h-5 w-5 fill-[#DCFCE7]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Reminder 1 Sent
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.reminderDate} at {record.reminderTime}
                  </p>
                </div>
              </div>

              {/* Step 3: Reply Received */}
              <div className="relative">
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] ring-2 ring-white">
                  <Undo2 className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Reply Received
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.replyDate || "May 18, 2024"} at{" "}
                    {record.replyTime || "02:15 PM"}
                  </p>
                </div>
              </div>

              {/* Step 4: Interview Scheduled */}
              <div className="relative">
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] ring-2 ring-white">
                  <Calendar className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Interview Scheduled
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.interviewDate || "May 25, 2024"} at{" "}
                    {record.interviewTime || "11:00 AM"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Notes, Attachments, Last Updated) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notes Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 font-heading">
                Notes
              </h4>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Edit Notes"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {record.notes}
            </p>
          </div>

          {/* Attachments Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Attachments
            </h4>

            <div className="space-y-2.5">
              {(
                record.attachments || [
                  { name: "MY_CV.pdf", size: "2.4 MB", type: "pdf" },
                  { name: "Research_Proposal.pdf", size: "1.8 MB", type: "pdf" },
                ]
              ).map((att) => (
                <div
                  key={att.name}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">PDF</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {att.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{att.size}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                    title="Download Attachment"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="px-1 text-xs space-y-0.5 text-left">
            <p className="font-bold text-slate-900">Last Updated</p>
            <p className="text-slate-500">
              {record.lastUpdated?.date || "May 18, 2024 at 02:20 PM"}
            </p>
            <p className="text-slate-500">
              by {record.lastUpdated?.author || "Sahriar Wahid"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
