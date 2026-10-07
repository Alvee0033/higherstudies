"use client";

import * as React from "react";
import Image from "next/image";
import { Building2, GraduationCap, CheckCircle2, HelpCircle } from "lucide-react";
import { ProfessorProfileData } from "./profile-types";

interface ProfileHeroCardProps {
  profile: ProfessorProfileData;
}

export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#5D5CDE] p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Avatar & Core Bio */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-xs">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-2 flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                {profile.name}
              </h1>
              {profile.verified && (
                <CheckCircle2 className="h-5 w-5 text-[#5D3FD3] fill-[#5D3FD3]/10 shrink-0" />
              )}
            </div>

            <p className="text-sm font-medium text-slate-600">
              {profile.title}
            </p>

            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{profile.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{profile.department}</span>
              </div>
            </div>

            {/* Research tags matching exact Figma #EEF2FF bg and #4F46E5 text */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {profile.tags.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]"
                >
                  {topic}
                </span>
              ))}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]">
                +2
              </span>
            </div>

            {/* Acceptance badge matching exact Figma green */}
            {profile.acceptingStudents && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#15803D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Accepting PhD Students
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Metrics Grid (2x3) matching Figma typography */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 text-left lg:text-right shrink-0">
          <div>
            <p className="text-xs font-medium text-slate-500">h-index</p>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.hIndex}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Citations</p>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.citations}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Publications</p>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.publications}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Years at MIT</p>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.yearsAtMit}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 lg:justify-end text-slate-500">
              <span className="text-xs font-medium">Avg. Response Time</span>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.avgResponseTime}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Current Students</p>
            <p className="text-base sm:text-lg font-bold text-slate-900">{profile.metrics.currentStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
