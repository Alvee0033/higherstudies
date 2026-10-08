import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplicationOverviewItem } from "../dashboard-types";
import { DEFAULT_APP_OVERVIEW } from "../dashboard-data";

export interface DashboardApplicationDonutCardProps {
  items?: ApplicationOverviewItem[];
  total?: number;
  className?: string;
}

export function DashboardApplicationDonutCard({
  items = DEFAULT_APP_OVERVIEW,
  total = 8,
  className,
}: DashboardApplicationDonutCardProps) {
  return (
    <Card className={`rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Application Overview
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 items-center gap-4">
          {/* Breakdown Legend */}
          <div className="space-y-2">
            {items.map((item) => (
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
              <span className="text-2xl font-black text-slate-900 leading-none">{total}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Total
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
