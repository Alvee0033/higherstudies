'use client';

import * as React from 'react';
import Link from 'next/link';
import { Compass, Users, MailCheck } from 'lucide-react';

export interface DashboardGreetingProps {
  name?: string;
  subtitle?: string;
}

export function DashboardGreeting({
  name = 'Student',
  subtitle = "Here's what's happening with your applications and professor outreach today.",
}: DashboardGreetingProps) {
  return (
    <div className="client-dashboard-hero flex flex-col justify-between gap-6 p-6 sm:p-8 lg:p-9">
      <div className="relative z-10 max-w-[32rem] space-y-3">
        <span className="client-eyebrow">Good morning, {name}!</span>
        <h1 className="font-heading text-[2rem] sm:text-[2.65rem] leading-[1.08] font-extrabold tracking-tight text-[#092653]">
          A brighter global future<br />is within your reach
        </h1>
        <p className="max-w-md text-sm text-[#3c608c] leading-relaxed">{subtitle}</p>
      </div>

      {/* Quick Action Navigation */}
      <div className="relative z-10 flex items-center gap-2 flex-wrap shrink-0">
        <Link
          href="/programs"
          className="client-primary-action inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white transition-all duration-150"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Explore Programmes</span>
        </Link>
        <Link
          href="/professors"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-[#16477f] bg-white/90 border border-white shadow-sm hover:bg-white transition-all duration-150"
        >
          <Users className="h-3.5 w-3.5 text-violet-600" />
          <span>Find Faculty</span>
        </Link>
        <Link
          href="/email-tracker"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-[#16477f] bg-white/90 border border-white shadow-sm hover:bg-white transition-all duration-150"
        >
          <MailCheck className="h-3.5 w-3.5" />
          <span>Email Tracker</span>
        </Link>
      </div>
    </div>
  );
}
