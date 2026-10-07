import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "purple" | "neutral" | "popular";
}

export function Badge({
  className,
  variant = "purple",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    purple:
      "bg-[#EDE9FE] text-[#4F46E5] border border-[#DDD6FE]/80 font-bold text-xs tracking-wider uppercase px-4 py-1.5 rounded-full shadow-2xs",
    neutral:
      "bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-1.5 rounded-full border border-slate-200/60",
    popular:
      "bg-[#4F46E5] text-white font-extrabold text-[11px] tracking-wider uppercase px-4 py-1 rounded-full shadow-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
