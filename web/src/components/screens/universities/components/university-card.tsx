import * as React from "react";
import Link from "next/link";
import { MapPin, Heart, AlertCircle, FileText } from "lucide-react";
import { UniversityItem } from "../university-types";

export interface UniversityCardProps {
  university: UniversityItem;
  isFirst?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function UniversityCard({
  university: uni,
  isFirst = false,
  isFavorite = false,
  onToggleFavorite,
}: UniversityCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 border shadow-2xs relative text-left transition-all ${
        isFirst ? "border-[#5D3FD3] ring-1 ring-[#5D3FD3]/30" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Best Match Pill on MIT card */}
      {isFirst && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold shadow-2xs">
            Best Match
          </span>
        </div>
      )}

      {/* Bookmark Heart Top-Right */}
      <button
        type="button"
        onClick={() => onToggleFavorite?.(uni.id)}
        className="absolute top-6 right-6 p-1 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
        aria-label="Save university"
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? "fill-[#EF4444] text-[#EF4444]" : "text-slate-300"
          }`}
        />
      </button>

      {/* University Profile Info */}
      <div className="flex items-start gap-4">
        {/* Logo container */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border border-slate-100 bg-white p-2 shrink-0 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uni.logo}
            alt={uni.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-6 sm:pr-8">
          <h3 className="text-base sm:text-xl font-bold text-slate-900 font-heading leading-snug">
            {uni.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{uni.location}</span>
          </div>

          {uni.badge && (
            <div className="mt-2">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#5D3FD3] text-[11px] sm:text-xs font-medium">
                {uni.badge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Metrics Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 pt-4 pb-4 border-b border-slate-100 text-left">
        <div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">QS Ranking</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.qsRank}</p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Acceptance Rate</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.acceptanceRate}</p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Annual Tuition</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.annualTuition}</p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Match Score</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm sm:text-base font-bold text-slate-900">{uni.matchScore}%</span>
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-emerald-500 border-t-transparent -rotate-45 shrink-0" />
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Badges + View Professors Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-3">
        {/* 3 Requirement Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {uni.greRequired && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[11px] sm:text-xs font-semibold text-[#DC2626]">
              <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>GRE Required</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[11px] sm:text-xs font-semibold text-[#2563EB]">
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span>IELTS {uni.ieltsScore}</span>
          </div>

          {uni.fundingAvailable && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] sm:text-xs font-semibold text-[#16A34A]">
              <span>Funding Available</span>
            </div>
          )}
        </div>

        {/* View Professors Button */}
        <Link
          href="/professors"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold flex items-center justify-center text-center shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          View Professors
        </Link>
      </div>
    </div>
  );
}
