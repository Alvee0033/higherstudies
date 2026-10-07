import * as React from "react";
import { ResearchProjectItem } from "./profile-types";

interface ProfileProjectsCardProps {
  projects: ResearchProjectItem[];
  totalProjects: number;
}

export function ProfileProjectsCard({
  projects,
  totalProjects,
}: ProfileProjectsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-heading">
          Current Research Projects
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer"
        >
          View all ({totalProjects}) &gt;
        </button>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        {projects.map((proj, idx) => (
          <div
            key={proj.title}
            className={`flex items-center justify-between py-2 ${
              idx < projects.length - 1 ? "border-b border-slate-50" : ""
            }`}
          >
            <span className="font-semibold text-slate-800">{proj.title}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{proj.period}</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${proj.funderBadgeClass}`}
              >
                {proj.funder}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
