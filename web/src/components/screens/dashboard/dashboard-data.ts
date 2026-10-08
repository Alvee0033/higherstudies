import {
  Building2,
  Users,
  Mail,
  MessageSquare,
  FileText,
  LucideIcon,
} from "lucide-react";
import {
  DashboardStat,
  DashboardReminder,
  RecentEmail,
  ApplicationOverviewItem,
} from "./dashboard-types";

import rawStats from "@/data/json/dashboard/stats.json";
import rawReminders from "@/data/json/dashboard/reminders.json";
import rawEmails from "@/data/json/dashboard/recent-emails.json";
import rawAppOverview from "@/data/json/dashboard/application-overview.json";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Users,
  Mail,
  MessageSquare,
  FileText,
};

export const DEFAULT_STATS: DashboardStat[] = rawStats.map((item) => ({
  label: item.label,
  count: item.count,
  color: item.color,
  bg: item.bg,
  icon: ICON_MAP[item.iconName] || Building2,
}));

export const DEFAULT_REMINDERS: DashboardReminder[] = rawReminders;
export const DEFAULT_RECENT_EMAILS: RecentEmail[] = rawEmails;
export const DEFAULT_APP_OVERVIEW: ApplicationOverviewItem[] = rawAppOverview;
