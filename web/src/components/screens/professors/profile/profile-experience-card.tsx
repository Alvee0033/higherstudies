import * as React from "react";
import { ExperienceItem } from "./profile-types";

interface ProfileExperienceCardProps {
  experience: ExperienceItem[];
}

export function ProfileExperienceCard({ experience }: ProfileExperienceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <h2 className="text-lg font-bold text-slate-900 font-heading">
        Academic Rank & Experience
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experience.map((item, idx) => (
          <div key={`${item.period}-${idx}`} className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#5D3FD3] mt-1.5 shrink-0" />
            <div>
              <span className="text-xs text-slate-400">{item.period}</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
