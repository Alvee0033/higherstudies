"use client";

import * as React from "react";
import { DashboardGreeting } from "./components/dashboard-greeting";
import { DashboardKpiGrid } from "./components/dashboard-kpi-grid";
import { DashboardRemindersCard } from "./components/dashboard-reminders-card";
import { DashboardApplicationDonutCard } from "./components/dashboard-application-donut-card";
import { DashboardRecentEmailsTable } from "./components/dashboard-recent-emails-table";

export function StudentDashboardView() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Greeting */}
      <DashboardGreeting />

      {/* 5 KPI Stat Cards Grid */}
      <DashboardKpiGrid />

      {/* Middle Row: Reminders & Application Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-7">
          <DashboardRemindersCard />
        </div>
        <div className="lg:col-span-5">
          <DashboardApplicationDonutCard />
        </div>
      </div>

      {/* Bottom Row: Recent Emails Activity Table */}
      <DashboardRecentEmailsTable />
    </div>
  );
}
