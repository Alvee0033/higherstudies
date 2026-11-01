'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DashboardReminder } from '../dashboard-types';
import { DEFAULT_REMINDERS } from '../dashboard-data';
import { DashboardReminderItem } from './dashboard-reminder-item';

export interface DashboardRemindersCardProps {
  reminders?: DashboardReminder[];
  onSendReminder?: (id: string) => void;
  className?: string;
}

export function DashboardRemindersCard({
  reminders = DEFAULT_REMINDERS,
  onSendReminder,
  className,
}: DashboardRemindersCardProps) {
  const hasReminders = reminders.length > 0;

  return (
    <Card
      className={`rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] bg-white flex flex-col justify-between space-y-4 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.05)] transition-all duration-200 ${
        className || ''
      }`}
    >
      <CardHeader className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Reminders Due
              </CardTitle>
              {hasReminders && (
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
                  {reminders.length}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Professor follow-ups & deadlines
            </p>
          </div>
        </div>
        <Link
          href="/email-tracker"
          className="text-xs font-bold text-[#1476F2] hover:text-[#0963D6] transition-colors flex items-center gap-1 group py-1.5 px-3 rounded-xl hover:bg-indigo-50/70"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {hasReminders ? (
          reminders.slice(0, 4).map((rem) => (
            <DashboardReminderItem
              key={rem.id}
              reminder={rem}
              onSendReminder={onSendReminder}
            />
          ))
        ) : (
          <div className="py-10 px-4 rounded-2xl bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-transparent border border-dashed border-slate-200/90 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100/90 flex items-center justify-center text-emerald-600 shadow-2xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">No follow-ups due today</p>
              <p className="text-xs text-slate-500 font-medium max-w-xs">
                All professor outreach follow-up dates are up to date. Schedule follow-ups when sending emails.
              </p>
            </div>
            <Link
              href="/email-tracker"
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-white border border-indigo-200 shadow-2xs hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-150"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-600" />
              <span>Log Professor Outreach</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
