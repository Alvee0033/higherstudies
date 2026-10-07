import * as React from "react";

interface ProfileResearchAreasCardProps {
  areas: string[];
}

export function ProfileResearchAreasCard({ areas }: ProfileResearchAreasCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-left">
      <h2 className="text-lg font-bold text-slate-900 font-heading">Research Areas</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {areas.map((area) => (
          <span
            key={area}
            className="px-3 py-1 rounded-full text-xs font-normal bg-[#F3F0FF] text-[#5D3FD3]"
          >
            {area}
          </span>
        ))}
        <span className="px-2.5 py-1 rounded-full text-xs font-normal bg-[#F3F4F6] text-[#4B5563]">
          +2
        </span>
      </div>
    </div>
  );
}
