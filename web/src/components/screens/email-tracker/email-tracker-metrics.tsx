import * as React from "react";
import { User, Mail, MessageSquare, Clock, Calendar, FileText } from "lucide-react";
import { MetricCardData } from "./email-tracker-types";

interface EmailTrackerMetricsProps {
  metrics: MetricCardData[];
}

export function EmailTrackerMetrics({ metrics }: EmailTrackerMetricsProps) {
  const renderIcon = (type: MetricCardData["type"]) => {
    switch (type) {
      case "professors":
        return <User className="h-5 w-5" />;
      case "sent":
        return <Mail className="h-5 w-5" />;
      case "replies":
        return <MessageSquare className="h-5 w-5" />;
      case "reminders":
        return <Clock className="h-5 w-5" />;
      case "interviews":
        return <Calendar className="h-5 w-5" />;
      case "applications":
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((m) => (
        <div
          key={m.title}
          className={`bg-white rounded-2xl border ${m.borderColor} p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3 text-left`}
        >
          <div
            className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
          >
            {renderIcon(m.type)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 leading-tight">
              {m.title}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-heading leading-none">
              {m.count}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5 whitespace-pre-line leading-tight">
              {m.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
