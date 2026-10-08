import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardReminder } from "../dashboard-types";
import { DEFAULT_REMINDERS } from "../dashboard-data";
import { DashboardReminderItem } from "./dashboard-reminder-item";

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
  return (
    <Card className={`rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-5 flex flex-col justify-between ${className || ""}`}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Reminder Due
        </CardTitle>
        <Link
          href="/email-tracker"
          className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {reminders.map((rem) => (
          <DashboardReminderItem
            key={rem.id}
            reminder={rem}
            onSendReminder={onSendReminder}
          />
        ))}
      </CardContent>
    </Card>
  );
}
