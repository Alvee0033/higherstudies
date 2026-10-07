import * as React from "react";
import { PublicationItem } from "./profile-types";

interface ProfilePublicationsCardProps {
  publications: PublicationItem[];
  totalPublications: number;
}

export function ProfilePublicationsCard({
  publications,
  totalPublications,
}: ProfilePublicationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Recent Publications</h2>
        <button
          type="button"
          className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer"
        >
          View all ({totalPublications})
        </button>
      </div>

      <div className="space-y-3">
        {publications.map((pub, idx) => (
          <div
            key={pub.title}
            className={`flex items-start justify-between gap-4 py-2 ${
              idx < publications.length - 1 ? "border-b border-slate-50" : ""
            }`}
          >
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {pub.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{pub.venue}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-slate-900">{pub.citations}</p>
              <p className="text-[10px] text-slate-400">Citations</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
