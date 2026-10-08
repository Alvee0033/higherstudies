import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardReminder } from "../dashboard-types";

export interface DashboardReminderItemProps {
  reminder: DashboardReminder;
  onSendReminder?: (id: string) => void;
}

export function DashboardReminderItem({
  reminder,
  onSendReminder,
}: DashboardReminderItemProps) {
  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/90 hover:bg-white hover:shadow-2xs transition-all">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={reminder.avatar}
            alt={reminder.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">{reminder.name}</h3>
          <p className="text-[11px] text-slate-500 font-medium">{reminder.university}</p>
          <p className="text-[10.5px] font-semibold text-amber-600 mt-0.5">{reminder.dueText}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="indigo-outline"
        size="sm"
        rounded="xl"
        onClick={() => onSendReminder?.(reminder.id)}
        className="px-3.5 py-2 text-xs font-bold gap-1.5 shrink-0"
      >
        <Send className="h-3 w-3" />
        <span>Send Reminder</span>
      </Button>
    </div>
  );
}
