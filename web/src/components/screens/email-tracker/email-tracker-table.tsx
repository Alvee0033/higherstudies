"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { EmailRecord, EmailStatus } from "./email-tracker-types";

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

  const renderUniversityLogo = (type: EmailRecord["universityLogoType"]) => {
    switch (type) {
      case "stanford":
        return (
          <div className="w-5 h-5 rounded bg-[#8C1515] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            S
          </div>
        );
      case "mit":
        return (
          <div className="text-[#A31F34] font-bold text-[11px] tracking-tighter shrink-0">
            MIT
          </div>
        );
      case "toronto":
        return (
          <div className="w-5 h-5 rounded bg-[#002A5C]/15 text-[#002A5C] text-[10px] font-bold flex items-center justify-center shrink-0">
            U
          </div>
        );
      case "berkeley":
        return (
          <div className="text-[#003262] font-bold text-[11px] shrink-0">
            Cal
          </div>
        );
      case "eth":
        return (
          <div className="text-black font-extrabold text-[11px] shrink-0">
            ETH
          </div>
        );
      default:
        return null;
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
            {records.map((row) => {
              const isSelected = selectedId === row.id;

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? "bg-[#EEF2FF]/40" : ""
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
                    <div className="flex items-center gap-2">
                      {renderUniversityLogo(row.universityLogoType)}
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

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>Showing 1 to 5 of 126 entries</p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-[#4F46E5] text-white font-semibold flex items-center justify-center cursor-pointer shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center cursor-pointer"
          >
            4
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center cursor-pointer"
          >
            5
          </button>
          <span className="text-slate-400 px-1">...</span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center justify-center cursor-pointer"
          >
            26
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
