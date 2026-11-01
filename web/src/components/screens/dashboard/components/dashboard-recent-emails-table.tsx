'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Plus, User, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UniversityLogo } from '@/components/ui/university-logo';
import { RecentEmail } from '../dashboard-types';
import { DEFAULT_RECENT_EMAILS } from '../dashboard-data';

export interface DashboardRecentEmailsTableProps {
  emails?: RecentEmail[];
  className?: string;
}

export function DashboardRecentEmailsTable({
  emails = DEFAULT_RECENT_EMAILS,
  className,
}: DashboardRecentEmailsTableProps) {
  const hasEmails = emails.length > 0;

  return (
    <Card
      className={`rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] bg-white space-y-4 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.05)] transition-all duration-200 ${
        className || ''
      }`}
    >
      <CardHeader className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Recent Outreach Emails
              </CardTitle>
              {hasEmails && (
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  {emails.length}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Latest professor correspondence & status
            </p>
          </div>
        </div>
        <Link
          href="/email-tracker"
          className="text-xs font-bold text-[#1476F2] hover:text-[#0963D6] transition-colors flex items-center gap-1 group py-1.5 px-3 rounded-xl hover:bg-indigo-50/70"
        >
          <span>View All Emails</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent>
        {hasEmails ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold pl-2">Professor</th>
                  <th className="pb-3 font-semibold">University</th>
                  <th className="pb-3 font-semibold">Subject</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {emails.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50/20 transition-colors group"
                  >
                    <td className="py-3.5 pl-2 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100/80 text-indigo-700 border border-indigo-100/90 flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                          {row.professor ? row.professor.replace(/^(prof\.|dr\.)\s+/i, '').charAt(0) : <User className="h-3 w-3" />}
                        </div>
                        <span className="truncate max-w-[150px] group-hover:text-indigo-600 transition-colors">
                          {row.professor}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <div className="flex items-center gap-2">
                        <UniversityLogo
                          name={row.university}
                          url={row.universityUrl}
                          size="xs"
                          className="rounded-md shrink-0"
                        />
                        <span className="truncate max-w-[170px] font-medium text-slate-700">
                          {row.university}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">
                      <span className="truncate block max-w-[220px]" title={row.subject}>
                        {row.subject}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 font-medium whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs ${
                          row.status.toLowerCase().includes('positive') || row.status.toLowerCase().includes('interview')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : row.status.toLowerCase().includes('negative')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : row.status.toLowerCase().includes('reply')
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-indigo-50/70 text-indigo-700 border-indigo-100'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 px-4 rounded-2xl bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-transparent border border-dashed border-slate-200/90 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100/90 flex items-center justify-center text-blue-600 shadow-2xs">
              <Mail className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">No outreach emails recorded yet</p>
              <p className="text-xs text-slate-500 font-medium max-w-sm">
                Track emails sent to professors, interview responses, and deadlines in your Email Tracker.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href="/professors"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-2xs"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-600" />
                <span>Browse Professors</span>
              </Link>
              <Link
                href="/email-tracker"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 transition-all duration-150 shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log First Email</span>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
