import * as React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardStat } from "../dashboard-types";
import { DEFAULT_STATS } from "../dashboard-data";

export interface DashboardKpiGridProps {
  stats?: DashboardStat[];
}

export function DashboardKpiGrid({ stats = DEFAULT_STATS }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {stats.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.count}
        />
      ))}
    </div>
  );
}
