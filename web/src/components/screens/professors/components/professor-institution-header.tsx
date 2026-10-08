import * as React from "react";
import Link from "next/link";
import { Bookmark, Building2, Users, Compass, Award, Activity } from "lucide-react";

export interface ProfessorInstitutionHeaderProps {
  isSavedUniversity: boolean;
  onToggleSaveUniversity: () => void;
}

export function ProfessorInstitutionHeader({
  isSavedUniversity,
  onToggleSaveUniversity,
}: ProfessorInstitutionHeaderProps) {
  return (
    <>
      {/* 1. Breadcrumb matching Figma */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/universities" className="hover:text-slate-800 transition-colors">
          Universities
        </Link>
        <span>&gt;</span>
        <span className="text-slate-600">Massachusetts Institute of Technology</span>
        <span>&gt;</span>
        <span className="text-slate-900 font-semibold">Professors</span>
      </nav>

      {/* 2. MIT Header Card matching Figma */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* MIT Logo block */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#5D3FD3]/30 bg-slate-50 flex items-center justify-center shrink-0 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-[#A31F34] tracking-tighter">MIT</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Professors at MIT
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
                  Top 1 Worldwide
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Massachusetts Institute of Technology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleSaveUniversity}
              className={`h-9 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                isSavedUniversity
                  ? "bg-[#EEF2FF] border-[#6366F1] text-[#4F46E5]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSavedUniversity ? "fill-current" : ""}`} />
              <span>{isSavedUniversity ? "Saved University" : "Save University"}</span>
            </button>
            <Link
              href="/universities"
              className="h-9 px-4 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>University Details</span>
            </Link>
          </div>
        </div>

        {/* 5 Stats Cards matching exact Figma screen 05 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Total Professors</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">1,247</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Departments</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">33</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center shrink-0">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Research Areas</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">120+</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Active Researchers</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">892</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Avg h-index</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">45</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
