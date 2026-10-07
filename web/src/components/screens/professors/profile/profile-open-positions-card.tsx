import * as React from "react";
import { Briefcase } from "lucide-react";
import { OpenPositionItem } from "./profile-types";

interface ProfileOpenPositionsCardProps {
  positions: OpenPositionItem[];
}

export function ProfileOpenPositionsCard({ positions }: ProfileOpenPositionsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <h3 className="text-lg font-bold text-[#1A1C1E]">Open Positions</h3>
      <div className="space-y-3">
        {positions.map((pos) => (
          <div
            key={pos.title}
            className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div>
              <p className="text-sm font-normal text-[#1A1C1E]">{pos.title}</p>
              <p className="text-xs font-semibold text-[#474556] mt-0.5">{pos.term}</p>
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#C8C4D9] bg-white flex items-center justify-center shrink-0">
              <Briefcase className="h-4 w-4 text-[#474556]" />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full py-2.5 rounded-xl border border-[#440EE8] text-[#440EE8] hover:bg-[#440EE8] hover:text-white transition-colors text-sm font-normal cursor-pointer"
      >
        View Details
      </button>
    </div>
  );
}
