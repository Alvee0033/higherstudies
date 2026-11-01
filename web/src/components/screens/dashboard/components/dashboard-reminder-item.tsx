'use client';

import * as React from 'react';
import { Send, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversityLogo } from '@/components/ui/university-logo';
import { DashboardReminder } from '../dashboard-types';

export interface DashboardReminderItemProps {
  reminder: DashboardReminder;
  onSendReminder?: (id: string) => void;
}

export function DashboardReminderItem({
  reminder,
  onSendReminder,
}: DashboardReminderItemProps) {
  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-indigo-200 hover:shadow-[0_4px_16px_rgba(79,70,229,0.06)] transition-all duration-200 gap-3 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <UniversityLogo
          name={reminder.university}
          url={reminder.universityUrl}
          size="md"
          className="rounded-xl shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {reminder.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {reminder.university}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                reminder.isOverdue
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80'
              }`}
            >
              {reminder.isOverdue ? (
                <Clock className="h-3 w-3 text-rose-500" />
              ) : (
                <Calendar className="h-3 w-3 text-amber-500" />
              )}
              <span>{reminder.isOverdue ? 'Overdue: ' : 'Follow-up: '}{reminder.dueText}</span>
            </span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="indigo-outline"
        size="sm"
        rounded="xl"
        onClick={() => onSendReminder?.(reminder.id)}
        className="px-3.5 py-2 text-xs font-bold gap-1.5 shrink-0 bg-indigo-50/60 hover:bg-indigo-600 hover:text-white border-indigo-200 text-indigo-700 transition-all duration-150"
      >
        <Send className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Follow Up</span>
      </Button>
    </div>
  );
}
