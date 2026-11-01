import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  count: string | number;
  icon?: LucideIcon;
  color?: string;
  bg?: string;
  subtitle?: string;
  href?: string;
}

export interface DashboardReminder {
  id: string;
  name: string;
  university: string;
  dueText: string;
  avatar?: string;
  universityUrl?: string | null;
  isOverdue?: boolean;
}

export interface RecentEmail {
  id: string;
  professor: string;
  university: string;
  universityUrl?: string | null;
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
