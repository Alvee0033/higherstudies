import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  count: string | number;
  icon?: LucideIcon;
  color?: string;
  bg?: string;
}

export interface DashboardReminder {
  id: string;
  name: string;
  university: string;
  dueText: string;
  avatar: string;
}

export interface RecentEmail {
  id: string;
  professor: string;
  university: string;
  subject: string;
  date: string;
  status: string;
  statusColor: string;
}

export interface ApplicationOverviewItem {
  label: string;
  count: number;
  color: string;
}
