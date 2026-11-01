"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  Undo2,
  Calendar,
  Pencil,
  Download,
} from "lucide-react";
import { EmailRecord } from "./email-tracker-types";
import { UniversityLogo } from "@/components/ui/university-logo";

interface EmailTrackerDetailViewProps {
  record: EmailRecord;
  onUpdate?:(data:Record<string,unknown>)=>Promise<void>;
}

export function EmailTrackerDetailView({ record,onUpdate }: EmailTrackerDetailViewProps) {
  const [editing,setEditing]=React.useState(false);
  const [notes,setNotes]=React.useState(record.notes);
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
                <UniversityLogo
                  name={record.universityName}
                  domain={record.universityUrl}
                  size={18}
                  className="rounded-md border border-slate-200"
                />
                <span className="font-semibold text-slate-800">
                  {record.universityName} {record.universitySub}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{record.location || "Not recorded"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${record.email}`}
                  className="text-[#1476F2] hover:underline truncate"
                >
                  {record.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <a
                  href={record.website||undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1476F2] hover:underline truncate"
                >
                  {record.website || "Not recorded"}
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
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-[#EAF5FF] flex items-center justify-center text-[#1476F2] ring-2 ring-white">
                  <Undo2 className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Reply Received
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.replyDate || "Not recorded"} at{" "}
                    {record.replyTime || "Not recorded"}
                  </p>
                </div>
              </div>

              {/* Step 4: Interview Scheduled */}
              <div className="relative">
                <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-[#EAF5FF] flex items-center justify-center text-[#1476F2] ring-2 ring-white">
                  <Calendar className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Interview Scheduled
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {record.interviewDate || "Not recorded"} at{" "}
                    {record.interviewTime || "Not recorded"}
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
                onClick={()=>setEditing(!editing)}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            {editing?<><textarea aria-label="Notes" value={notes} onChange={e=>setNotes(e.target.value)} maxLength={5000} className="w-full border border-slate-200 rounded-lg p-2 text-xs"/><button onClick={()=>void onUpdate?.({notes}).then(()=>setEditing(false))} className="text-xs text-indigo-600">Save notes</button></>:<p className="text-xs text-slate-600 leading-relaxed">{record.notes||'No notes yet.'}</p>}
            <label className="block text-xs text-slate-500">Tracking status<select aria-label="Tracking status" value={record.status} onChange={e=>{const map:Record<string,string>={'Not Sent':'draft','No Response':'sent','Waiting':'waiting','Positive Reply':'positive_reply','Negative Reply':'negative_reply','Interview':'interview'};void onUpdate?.({status:map[e.target.value]});}} className="block mt-2 border border-slate-200 rounded-lg p-2 w-full">{['Not Sent','No Response','Waiting','Positive Reply','Negative Reply','Interview'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="block text-xs text-slate-500">Follow-up date<input aria-label="Follow-up date" type="datetime-local" onChange={e=>{if(e.target.value)void onUpdate?.({followUpAt:new Date(e.target.value).toISOString()});}} className="block mt-2 border border-slate-200 rounded-lg p-2 w-full"/></label>
          </div>

          {/* Attachments Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Attachments
            </h4>

            <div className="space-y-2.5">
              {(
                record.attachments || []
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
              {record.lastUpdated?.date || "Not recorded"}
            </p>
            <p className="text-slate-500">
              by {record.lastUpdated?.author || "Not recorded"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
