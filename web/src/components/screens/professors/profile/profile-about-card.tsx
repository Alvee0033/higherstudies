"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import { AcademicDegree } from "./profile-types";

interface ProfileAboutCardProps {
  about: string;
  degrees: AcademicDegree[];
  researchInterests: string[];
}

export function ProfileAboutCard({
  about,
  degrees,
  researchInterests,
}: ProfileAboutCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <h2 className="text-lg font-bold text-slate-900 font-heading">About</h2>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {about}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Academic Background
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {degrees.map((deg) => (
              <li key={deg.degree} className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{deg.degree}</p>
                  <p className="text-slate-500">
                    {deg.institution}, {deg.year}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Research Interests
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {researchInterests.map((interest) => (
              <li key={interest}>• {interest}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}
