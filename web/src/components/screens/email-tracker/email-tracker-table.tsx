"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { EmailRecord, EmailStatus } from "./email-tracker-types";
import { UniversityLogo } from "@/components/ui/university-logo";

interface EmailTrackerTableProps {
  records: EmailRecord[];
  selectedId: string;
  onSelect: (record: EmailRecord) => void;
}

export function EmailTrackerTable({
  records,
  selectedId,
  onSelect,
}: EmailTrackerTableProps) {
  const [page,setPage]=React.useState(1);
  const currentPage=Math.min(page,Math.max(1,Math.ceil(records.length/10)));
  const renderStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case "Positive Reply":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
            Positive Reply
          </span>
        );
      case "Interview":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1D4ED8]">
            Interview
          </span>
        );
      case "No Response":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
            No Response
          </span>
        );
      case "Reminder Due":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#B45309]">
            Reminder Due
          </span>
        );
      case "Not Sent":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
            Not Sent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };


  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">PROFESSOR</th>
              <th className="py-3 px-4 font-bold">UNIVERSITY</th>
              <th className="py-3 px-4 font-bold">EMAIL</th>
              <th className="py-3 px-4 font-bold">
                MAIL SENT <br />
                <span className="text-[10px] font-normal text-slate-400">DATE &amp; TIME</span>
              </th>
              <th className="py-3 px-4 font-bold">
                REMINDER <br />
                <span className="text-[10px] font-normal text-slate-400">DATE &amp; TIME</span>
              </th>
              <th className="py-3 px-4 font-bold">
                REPLY RECEIVED <br />
                <span className="text-[10px] font-normal text-slate-400">DATE &amp; TIME</span>
              </th>
              <th className="py-3 px-4 font-bold">STATUS</th>
              <th className="py-3 px-3 font-bold text-center">NOTES</th>
              <th className="py-3 px-3 font-bold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.slice((currentPage-1)*10,currentPage*10).map((row) => {
              const isSelected = selectedId === row.id;

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? "bg-[#EAF5FF]/40" : ""
                  }`}
                >
                  {/* Professor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={row.avatar}
                          alt={row.professorName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-xs leading-tight">
                          {row.professorName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {row.professorTitle}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* University */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <UniversityLogo
                        name={row.universityName}
                        domain={row.universityUrl}
                        size={22}
                        className="rounded-md border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 text-xs leading-tight">
                          {row.universityName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {row.universitySub}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {row.email}
                  </td>

                  {/* Mail Sent */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-700 leading-tight">
                      {row.sentDate}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {row.sentTime}
                    </p>
                  </td>

                  {/* Reminder */}
                  <td className="py-3.5 px-4">
                    <p
                      className={`font-medium leading-tight ${
                        row.reminderOverdue ? "text-[#DC2626]" : "text-slate-700"
                      }`}
                    >
                      {row.reminderDate}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        row.reminderOverdue ? "text-[#DC2626]" : "text-slate-400"
                      }`}
                    >
                      {row.reminderTime}
                    </p>
                    {row.reminderOverdue && (
                      <span className="text-[10px] text-[#DC2626] font-medium block">
                        Reminder Due
                      </span>
                    )}
                  </td>

                  {/* Reply Received */}
                  <td className="py-3.5 px-4">
                    {row.replyDate ? (
                      <>
                        <p className="font-medium text-slate-700 leading-tight">
                          {row.replyDate}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {row.replyTime}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {renderStatusBadge(row.status)}
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(row);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                      title={row.notes}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 text-xs text-slate-500"><span>{records.length?((currentPage-1)*10+1):0}–{Math.min(currentPage*10,records.length)} of {records.length}</span><div className="flex gap-3"><button aria-label="Previous page" disabled={currentPage<=1} onClick={()=>setPage(currentPage-1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronLeft className="h-4 w-4"/></button><button aria-label="Next page" disabled={currentPage*10>=records.length} onClick={()=>setPage(currentPage+1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronRight className="h-4 w-4"/></button></div></div>
    </div>
  );
}
