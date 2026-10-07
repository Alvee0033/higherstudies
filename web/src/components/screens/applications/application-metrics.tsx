import * as React from "react";
import {
  Hourglass,
  FileText,
  Send,
  Calendar,
  Clock,
  Check,
  X,
  CreditCard,
} from "lucide-react";
import { ApplicationMetric } from "./application-types";

interface ApplicationMetricsProps {
  metrics: ApplicationMetric[];
}

export function ApplicationMetrics({ metrics }: ApplicationMetricsProps) {
  const getIconConfig = (type: ApplicationMetric["type"]) => {
    switch (type) {
      case "Not Started":
        return {
          icon: <Hourglass className="h-4 w-4" />,
          circleClass: "bg-slate-100 text-slate-400",
        };
      case "Preparing":
        return {
          icon: <FileText className="h-4 w-4" />,
          circleClass: "bg-blue-50 text-blue-500",
        };
      case "Submitted":
        return {
          icon: <Send className="h-4 w-4" />,
          circleClass: "bg-purple-50 text-purple-500",
        };
      case "Interview":
        return {
          icon: <Calendar className="h-4 w-4" />,
          circleClass: "bg-orange-50 text-orange-500",
        };
      case "Waiting":
        return {
          icon: <Clock className="h-4 w-4" />,
          circleClass: "bg-amber-50 text-amber-500",
        };
      case "Accepted":
        return {
          icon: <Check className="h-4 w-4 stroke-[2.5]" />,
          circleClass: "bg-emerald-50 text-emerald-500",
        };
      case "Rejected":
        return {
          icon: <X className="h-4 w-4 stroke-[2.5]" />,
          circleClass: "bg-rose-50 text-rose-400",
        };
      case "Visa":
        return {
          icon: <CreditCard className="h-4 w-4" />,
          circleClass: "bg-cyan-50 text-cyan-500",
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      {metrics.map((m) => {
        const config = getIconConfig(m.type);

        return (
          <div
            key={m.title}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between text-left"
          >
            <div>
              <p className="text-xs text-slate-500 font-medium leading-tight">
                {m.title}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-heading leading-tight">
                {m.count}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {m.percentage}
              </p>
            </div>

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.circleClass}`}
            >
              {config.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
