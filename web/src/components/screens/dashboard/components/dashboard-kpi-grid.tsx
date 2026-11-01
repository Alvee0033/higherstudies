'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardStat } from '../dashboard-types';
import { DEFAULT_STATS } from '../dashboard-data';

export interface DashboardKpiGridProps {
  stats?: DashboardStat[];
}

export function DashboardKpiGrid({ stats = DEFAULT_STATS }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {stats.map((item) => {
        const cardContent = (
          <div className="relative group cursor-pointer h-full">
            <StatCard
              label={item.label}
              value={typeof item.count === 'number' ? item.count.toLocaleString() : item.count}
              icon={item.icon}
              iconColor={item.color}
              iconBg={item.bg}
              subtitle={item.subtitle}
              className="h-full"
            />
            {item.href && (
              <span className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        );

        return item.href ? (
          <Link key={item.label} href={item.href} className="block h-full">
            {cardContent}
          </Link>
        ) : (
          <div key={item.label} className="h-full">{cardContent}</div>
        );
      })}
    </div>
  );
}
