'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/use-api';
import { useStudent } from '@/components/layout/student-session';
import { workspace, placeholderAvatar } from '@/lib/student-api';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { DashboardGreeting } from './components/dashboard-greeting';
import { DashboardKpiGrid } from './components/dashboard-kpi-grid';
import { DashboardRemindersCard } from './components/dashboard-reminders-card';
import { DashboardApplicationDonutCard } from './components/dashboard-application-donut-card';
import { DashboardRecentEmailsTable } from './components/dashboard-recent-emails-table';
import { DEFAULT_STATS, DEFAULT_APP_OVERVIEW } from './dashboard-data';

interface Summary {
  programmes: number;
  faculty: number;
  institutions?: number;
  applications: number;
  sent: number;
  replies: number;
  statuses: { status: string; count: number }[];
  emails: {
    id: string;
    professor_name: string;
    institution_name: string;
    institution_url?: string | null;
    subject: string;
    sent_at: string;
    follow_up_at: string;
    status: string;
  }[];
}

export function StudentDashboardView() {
  const { user } = useStudent();
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(frame);
  }, []);
  const router = useRouter();
  const result = useApi<{ data: Summary }>(`${workspace}/summary`);
  const data = result.data?.data;

  const counts = [
    data?.programmes,
    data?.faculty,
    data?.sent,
    data?.replies,
    data?.applications,
  ];

  const stats = DEFAULT_STATS.map((item, index) => ({
    ...item,
    count: counts[index] ?? 0,
  }));

  const items = DEFAULT_APP_OVERVIEW.map((item) => ({
    ...item,
    count: data?.statuses.find((row) => row.status === item.label)?.count ?? 0,
  }));

  const emails = (data?.emails ?? [])
    .filter((row) => row.sent_at)
    .map((row) => ({
      id: row.id,
      professor: row.professor_name,
      university: row.institution_name,
      universityUrl: row.institution_url,
      subject: row.subject || 'No subject recorded',
      date: new Date(row.sent_at).toLocaleDateString(),
      status: row.status.replaceAll('_', ' '),
      statusColor: 'bg-indigo-50 text-indigo-600',
    }));

  const reminders = (data?.emails ?? [])
    .filter((row) => row.follow_up_at)
    .map((row) => {
      const followUpTime = Date.parse(row.follow_up_at);
      const isOverdue = now !== null && Number.isFinite(followUpTime) && followUpTime < now;
      return {
        id: row.id,
        name: row.professor_name,
        university: row.institution_name,
        universityUrl: row.institution_url,
        dueText: new Date(row.follow_up_at).toLocaleDateString(),
        avatar: placeholderAvatar,
        isOverdue,
      };
    });

  return (
    <div className="space-y-6 sm:space-y-7 max-w-7xl mx-auto">
      {/* 1. Greeting & Quick Action Header */}
      <DashboardGreeting name={user.displayName} />

      {/* Error Banner */}
      {result.error && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{result.error}</span>
          </div>
          <button
            onClick={result.reload}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer text-xs font-bold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. Top KPI Stat Cards Grid (5 columns on desktop, compact & clickable) */}
      <DashboardKpiGrid stats={stats} />

      {/* 3. Middle 2-Column Section (7-col Reminders + 5-col Donut Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        <div className="lg:col-span-7">
          <DashboardRemindersCard
            reminders={reminders}
            onSendReminder={() => router.push('/email-tracker')}
          />
        </div>
        <div className="lg:col-span-5">
          <DashboardApplicationDonutCard
            items={items}
            total={data?.applications ?? 0}
          />
        </div>
      </div>

      {/* 4. Bottom Activity Table (Recent Emails with University Logos) */}
      <DashboardRecentEmailsTable emails={emails} />
    </div>
  );
}
