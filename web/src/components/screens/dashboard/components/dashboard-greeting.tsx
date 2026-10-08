import * as React from "react";

export interface DashboardGreetingProps {
  name?: string;
  subtitle?: string;
}

export function DashboardGreeting({
  name = "Ahmed",
  subtitle = "Here's what's happening with your applications.",
}: DashboardGreetingProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-2">
        <span>Welcome back, {name}!</span>
        <span className="text-2xl sm:text-3xl">👋</span>
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium">
        {subtitle}
      </p>
    </div>
  );
}
