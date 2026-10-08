import {
  Building2,
  Users,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  DashboardStat,
  DashboardReminder,
  RecentEmail,
  ApplicationOverviewItem,
} from "./dashboard-types";

export const DEFAULT_STATS: DashboardStat[] = [
  { label: "Saved Universities", count: "24", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Saved Professors", count: "36", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Emails Sent", count: "128", icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Replies Received", count: "15", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Applications", count: "8", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
];

export const DEFAULT_REMINDERS: DashboardReminder[] = [
  {
    id: "1",
    name: "Prof. John Smith",
    university: "MIT",
    dueText: "Reminder due in 2 days",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "2",
    name: "Prof. David Lee",
    university: "Stanford University",
    dueText: "Reminder due in 3 days",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
];

export const DEFAULT_RECENT_EMAILS: RecentEmail[] = [
  {
    id: "1",
    professor: "Prof. Emma Brown",
    university: "University of Toronto",
    subject: "AI & ML",
    date: "May 10, 2024",
    status: "Replied",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    id: "2",
    professor: "Prof. Michael Chen",
    university: "UC Berkeley",
    subject: "Computer Vision",
    date: "May 8, 2024",
    status: "Waiting",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  {
    id: "3",
    professor: "Prof. John Smith",
    university: "MIT",
    subject: "Robotics",
    date: "May 5, 2024",
    status: "Reminder Due",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200/80",
  },
];

export const DEFAULT_APP_OVERVIEW: ApplicationOverviewItem[] = [
  { label: "Not Started", count: 2, color: "#6366F1" },
  { label: "Preparing", count: 1, color: "#94A3B8" },
  { label: "Submitted", count: 3, color: "#4F46E5" },
  { label: "Interview", count: 1, color: "#F59E0B" },
  { label: "Accepted", count: 1, color: "#10B981" },
  { label: "Rejected", count: 0, color: "#EF4444" },
];
