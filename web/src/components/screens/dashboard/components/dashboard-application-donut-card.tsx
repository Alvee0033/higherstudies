'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ApplicationOverviewItem } from '../dashboard-types';
import { DEFAULT_APP_OVERVIEW } from '../dashboard-data';

export interface DashboardApplicationDonutCardProps {
  items?: ApplicationOverviewItem[];
  total?: number;
  className?: string;
}

export function DashboardApplicationDonutCard({
  items = DEFAULT_APP_OVERVIEW,
  total = 0,
  className,
}: DashboardApplicationDonutCardProps) {
  const circumference = 2 * Math.PI * 38;

  return (
    <Card
      className={`rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] bg-white flex flex-col justify-between space-y-4 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.05)] transition-all duration-200 ${
        className || ''
      }`}
    >
      <CardHeader className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/70 border border-violet-100 flex items-center justify-center text-violet-600 shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Application Overview
            </CardTitle>
            <p className="text-[11px] font-medium text-slate-400">
              Admission pipeline status
            </p>
          </div>
        </div>
        <Link
          href="/applications"
          className="text-xs font-bold text-[#1476F2] hover:text-[#0963D6] transition-colors flex items-center gap-1 group py-1.5 px-3 rounded-xl hover:bg-indigo-50/70"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-2 items-center gap-4">
          {/* Breakdown Legend */}
          <div className="space-y-1.5">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium text-[11.5px] truncate">
                    {item.label}
                  </span>
                </div>
                <span className="font-bold text-slate-900 text-xs shrink-0 pl-1.5 font-heading">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          {/* Circular Donut Diagram */}
          <div className="relative flex items-center justify-center py-1">
            <svg className="w-36 h-36 sm:w-40 sm:h-40 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                className="text-slate-100 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              {total > 0 &&
                items.map((item, index) => {
                  if (item.count <= 0) return null;
                  const before = items.slice(0, index).reduce((sum, row) => sum + row.count, 0);
                  const strokeLength = (item.count / total) * circumference;
                  const strokeOffset = -(before / total) * circumference;
                  return (
                    <circle
                      key={item.label}
                      cx="50"
                      cy="50"
                      r="38"
                      stroke={item.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray={`${strokeLength} ${circumference}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500 ease-out"
                    />
                  );
                })}
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl sm:text-[30px] font-black text-slate-900 leading-none font-heading tracking-tight">
                {total}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                {total === 1 ? 'Application' : 'Total'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
