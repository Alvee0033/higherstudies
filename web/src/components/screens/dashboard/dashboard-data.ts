import { Building2, Users, Mail, MessageSquare, FileText } from 'lucide-react';
import type { DashboardStat, DashboardReminder, RecentEmail, ApplicationOverviewItem } from './dashboard-types';

export const DEFAULT_STATS: DashboardStat[] = [
  {
    label: 'Programmes',
    icon: Building2,
    count: 0,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border border-indigo-100/80',
    subtitle: 'In live catalogue',
    href: '/programs',
  },
  {
    label: 'Faculty',
    icon: Users,
    count: 0,
    color: 'text-violet-600',
    bg: 'bg-violet-50 border border-violet-100/80',
    subtitle: 'Across universities',
    href: '/professors',
  },
  {
    label: 'Emails sent',
    icon: Mail,
    count: 0,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border border-blue-100/80',
    subtitle: 'Outreach logged',
    href: '/email-tracker',
  },
  {
    label: 'Replies',
    icon: MessageSquare,
    count: 0,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border border-emerald-100/80',
    subtitle: 'Responses tracked',
    href: '/email-tracker',
  },
  {
    label: 'Applications',
    icon: FileText,
    count: 0,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border border-amber-100/80',
    subtitle: 'Active pipeline',
    href: '/applications',
  },
];

export const DEFAULT_REMINDERS: DashboardReminder[] = [];
export const DEFAULT_RECENT_EMAILS: RecentEmail[] = [];

export const DEFAULT_APP_OVERVIEW: ApplicationOverviewItem[] = [
  'Not Started',
  'Preparing',
  'Submitted',
  'Interview',
  'Waiting',
  'Accepted',
  'Rejected',
  'Visa',
].map((label, index) => ({
  label,
  count: 0,
  color: [
    '#94a3b8',
    '#6366f1',
    '#4f46e5',
    '#06b6d4',
    '#eab308',
    '#10b981',
    '#ef4444',
    '#8b5cf6',
  ][index],
}));
