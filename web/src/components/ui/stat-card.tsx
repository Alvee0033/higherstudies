import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  subtitle?: string;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  subtitle,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.12),0_4px_10px_-2px_rgba(0,0,0,0.04)] hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group",
        className
      )}
    >
      {/* Top subtle decorative ambient glow on card hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      <div className="flex items-center justify-between gap-2 relative z-10">
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-tight leading-snug truncate group-hover:text-slate-700 transition-colors">
          {label}
        </p>
        {Icon && (
          <div
            className={cn(
              "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm",
              iconBg || "bg-slate-50 text-slate-600",
              iconColor
            )}
          >
            <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-3.5 relative z-10">
        <span
          className={cn(
            "text-2xl sm:text-[28px] font-black text-slate-900 font-heading tracking-tight leading-none group-hover:text-indigo-950 transition-colors",
            valueClassName
          )}
        >
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-bold px-1.5 py-0.5 rounded-md",
              trend.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] font-medium text-slate-400 mt-2 truncate relative z-10">
          {subtitle}
        </p>
      )}
    </div>
  );
}
