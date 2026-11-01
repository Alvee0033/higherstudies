import * as React from "react";
import Link from "next/link";
import { Bookmark, Building2, Users, BookOpen, ExternalLink, X } from "lucide-react";
import { UniversityLogo } from "@/components/ui/university-logo";

export interface ProfessorInstitutionHeaderProps {
  institutionName?: string;
  total?: number;
  institutionUrl?: string;
  institutionId?: string;
  isSavedUniversity: boolean;
  onToggleSaveUniversity: () => void;
  onClearInstitution?: () => void;
}

export function ProfessorInstitutionHeader({
  institutionName = "All institutions",
  total = 0,
  institutionUrl,
  institutionId,
  isSavedUniversity,
  onToggleSaveUniversity,
  onClearInstitution,
}: ProfessorInstitutionHeaderProps) {
  const isAll = institutionName === "All institutions" || !institutionId;

  return (
    <>
      {/* 1. Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/universities" className="hover:text-slate-800 transition-colors">
          Universities
        </Link>
        <span>&gt;</span>
        <span className="text-slate-600">{institutionName}</span>
        <span>&gt;</span>
        <span className="text-slate-900 font-semibold">Professors</span>
      </nav>

      {/* 2. University/Faculty Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Logo / Monogram block */}
            <UniversityLogo
              name={institutionName}
              domain={institutionUrl}
              size={64}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0"
            />

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {isAll ? "Faculty Directory" : institutionName}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5FF] text-[#1476F2] border border-[#E0E7FF]">
                  {isAll ? "All Universities" : "Affiliated Faculty"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isAll
                  ? "Explore sourced professors, researchers, and lab directors."
                  : `Showing verified faculty and research members at ${institutionName}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {institutionId && (
              <>
                <Link
                  href={`/programs?institutionId=${institutionId}&universityName=${encodeURIComponent(institutionName)}`}
                  className="h-9 px-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View Programmes</span>
                </Link>

                {onClearInstitution && (
                  <button
                    type="button"
                    onClick={onClearInstitution}
                    className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5 text-slate-400" />
                    <span>All Institutions</span>
                  </button>
                )}
              </>
            )}

            {institutionUrl && (
              <a
                href={institutionUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Website</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            )}

            {institutionId && (
              <button
                type="button"
                onClick={onToggleSaveUniversity}
                className={`h-9 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSavedUniversity
                    ? "bg-[#EAF5FF] border-[#6366F1] text-[#1476F2]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSavedUniversity ? "fill-current" : ""}`} />
                <span>{isSavedUniversity ? "Saved" : "Save"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Faculty Count</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">
                {total.toLocaleString()} Members
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Status</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">
                Catalogue Published
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
