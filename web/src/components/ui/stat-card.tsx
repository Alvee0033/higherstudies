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
        "bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-snug">
          {label}
        </p>
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
              iconBg || "bg-slate-50",
              iconColor || "text-slate-600"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <span
          className={cn(
            "text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight",
            valueClassName
          )}
        >
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-bold",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1.5 whitespace-pre-line leading-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}
