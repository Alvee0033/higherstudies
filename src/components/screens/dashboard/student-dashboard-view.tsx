"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Mail,
  MessageSquare,
  FileText,
  Send,
  ArrowRight,
} from "lucide-react";

export function StudentDashboardView() {
  const stats = [
    { label: "Saved Universities", count: "24", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Saved Professors", count: "36", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Emails Sent", count: "128", icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Replies Received", count: "15", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Applications", count: "8", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const reminders = [
    {
      id: "1",
      name: "Prof. John Smith",
      university: "MIT",
      dueText: "Reminder due in 2 days",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "2",
      name: "Prof. David Lee",
      university: "Stanford University",
      dueText: "Reminder due in 3 days",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
  ];

  const recentEmails = [
    {
      id: "1",
      professor: "Prof. Emma Brown",
      university: "University of Toronto",
      subject: "AI & ML",
      date: "May 10, 2024",
      status: "Replied",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    {
      id: "2",
      professor: "Prof. Michael Chen",
      university: "UC Berkeley",
      subject: "Computer Vision",
      date: "May 8, 2024",
      status: "Waiting",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    {
      id: "3",
      professor: "Prof. John Smith",
      university: "MIT",
      subject: "Robotics",
      date: "May 5, 2024",
      status: "Reminder Due",
      statusColor: "bg-rose-50 text-rose-700 border-rose-200/80",
    },
  ];

  const appOverview = [
    { label: "Not Started", count: 2, color: "#6366F1" },
    { label: "Preparing", count: 1, color: "#94A3B8" },
    { label: "Submitted", count: 3, color: "#4F46E5" },
    { label: "Interview", count: 1, color: "#F59E0B" },
    { label: "Accepted", count: 1, color: "#10B981" },
    { label: "Rejected", count: 0, color: "#EF4444" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-2">
          <span>Welcome back, Ahmed!</span>
          <span className="text-2xl sm:text-3xl">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Here&apos;s what&apos;s happening with your applications.
        </p>
      </div>

      {/* 5 KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
          >
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-snug">
              {item.label}
            </p>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Reminders & Application Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Reminder Due Card (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Reminder Due
            </h2>
            <Link
              href="/email-tracker"
              className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/90 hover:bg-white hover:shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rem.avatar} alt={rem.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{rem.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{rem.university}</p>
                    <p className="text-[10.5px] font-semibold text-amber-600 mt-0.5">{rem.dueText}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-[#4F46E5] text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="h-3 w-3" />
                  <span>Send Reminder</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Overview Donut Card (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            Application Overview
          </h2>

          <div className="grid grid-cols-2 items-center gap-4">
            {/* Breakdown Legend */}
            <div className="space-y-2">
              {appOverview.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium text-[11.5px]">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Circular Donut Diagram */}
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-slate-100 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Submitted: 3/8 = 37.5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#4F46E5"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset="149.2"
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* Not Started: 2/8 = 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#6366F1"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset="179.0"
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* Preparing: 1/8 = 12.5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#94A3B8"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset="208.9"
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* Accepted: 1/8 = 12.5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset="220.0"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">8</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Emails Activity Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            Recent Emails
          </h2>
          <Link
            href="/email-tracker"
            className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Professor</th>
                <th className="pb-3 font-semibold">University</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentEmails.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">{row.professor}</td>
                  <td className="py-3.5 text-slate-600">{row.university}</td>
                  <td className="py-3.5 text-slate-600 font-medium">{row.subject}</td>
                  <td className="py-3.5 text-slate-400">{row.date}</td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
