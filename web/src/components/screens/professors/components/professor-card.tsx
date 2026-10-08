import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, CheckCircle2, GraduationCap } from "lucide-react";
import { Professor } from "../professor-types";

export interface ProfessorCardProps {
  professor: Professor;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function ProfessorCard({
  professor: prof,
  isSaved = false,
  onToggleSave,
}: ProfessorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all text-left flex flex-col md:flex-row gap-5 items-start justify-between">
      {/* Left profile info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border border-slate-200">
          <Image
            src={prof.avatar}
            alt={prof.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/professors/${prof.id}`}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#5D3FD3] transition-colors"
            >
              {prof.name}
            </Link>
            {prof.verified && (
              <CheckCircle2 className="h-4 w-4 text-[#5D3FD3] fill-[#5D3FD3]/10 shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {prof.title}
          </p>

          {/* Topic Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {prof.topics.map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-slate-700"
              >
                {t}
              </span>
            ))}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
              +2
            </span>
          </div>

          {/* PhD text */}
          <div className="flex items-center gap-1.5 pt-2 text-xs text-slate-500">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <span>{prof.phd}</span>
          </div>
        </div>
      </div>

      {/* Right metrics + actions */}
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={() => onToggleSave?.(prof.id)}
          className={`text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer hidden md:block ${
            isSaved ? "text-[#5D3FD3] hover:text-[#5D3FD3]" : ""
          }`}
          aria-label="Bookmark professor"
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-[#5D3FD3] text-[#5D3FD3]" : ""}`} />
        </button>

        {/* 2x3 Metrics Grid matching Figma */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left md:text-right">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">H-INDEX</p>
            <p className="text-sm font-bold text-slate-900">{prof.hIndex}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">CITATIONS</p>
            <p className="text-sm font-bold text-slate-900">{prof.citations}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">PUBLICATIONS</p>
            <p className="text-sm font-bold text-slate-900">{prof.publications}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">YEARS AT MIT</p>
            <p className="text-sm font-bold text-slate-900">{prof.yearsAtMit}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">CURRENT STUDENTS</p>
            <p className="text-sm font-bold text-slate-900">{prof.currentStudents}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">OPENINGS</p>
            <p className="text-sm font-bold text-emerald-600">{prof.openings}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSave?.(prof.id)}
            className={`md:hidden p-2 rounded-xl border border-slate-200 text-slate-500 cursor-pointer ${
              isSaved ? "text-[#5D3FD3] border-[#5D3FD3]" : ""
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-[#5D3FD3]" : ""}`} />
          </button>
          <Link
            href={`/professors/${prof.id}`}
            className="px-5 py-2 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
