import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecentEmail } from "../dashboard-types";
import { DEFAULT_RECENT_EMAILS } from "../dashboard-data";

export interface DashboardRecentEmailsTableProps {
  emails?: RecentEmail[];
  className?: string;
}

export function DashboardRecentEmailsTable({
  emails = DEFAULT_RECENT_EMAILS,
  className,
}: DashboardRecentEmailsTableProps) {
  return (
    <Card className={`rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-4 ${className || ""}`}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Recent Emails
        </CardTitle>
        <Link
          href="/email-tracker"
          className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="overflow-x-auto">
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
            {emails.map((row) => (
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
      </CardContent>
    </Card>
  );
}
