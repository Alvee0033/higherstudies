import * as React from "react";
import Link from "next/link";
import { CampusPhoto } from "@/components/ui/campus-photo";
import type { CampusImage } from "@/hooks/use-campus-images";
import {
  GraduationCap,
  MapPin,
  Heart,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  FileText,
  Sparkles,
} from "lucide-react";
import { ProgramItem } from "../program-types";
import { UniversityLogo } from "@/components/ui/university-logo";

export interface ProgramCardProps {
  program: ProgramItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  campusImage?: CampusImage | null;
}

export function ProgramCard({
  program: prog,
  isFavorite = false,
  onToggleFavorite,
  campusImage,
}: ProgramCardProps) {
  const isPhd = prog.degree?.toLowerCase().includes("phd") || prog.degree?.toLowerCase().includes("doc");
  const isTuitionFree =
    prog.tuitionText.toLowerCase().includes("free") ||
    prog.tuitionText.toLowerCase().includes("funded") ||
    prog.tuitionText.toLowerCase().includes("0 ");

  return (
    <div className="client-program-card bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-md relative text-left transition-all duration-200">
      {/* Favorite Bookmark Top-Right */}
      <button
        type="button"
        onClick={() => onToggleFavorite?.(prog.id)}
        className="absolute top-6 right-6 p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
        aria-label="Save programme"
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? "fill-[#EF4444] text-[#EF4444]" : "text-slate-300"
          }`}
        />
      </button>

      {/* Program Header with Bigger University Logo */}
      <div className="flex items-start gap-4 pr-10">
        {/* Bigger University Icon */}
        <div className="relative shrink-0 pt-0.5">
          {campusImage ? (
            <CampusPhoto image={campusImage} institution={prog.institutionName} className="h-24 w-24 rounded-xl sm:h-28 sm:w-32" />
          ) : (
            <UniversityLogo name={prog.institutionName} domain={prog.institutionOfficialUrl} size={50} className="w-12 h-12 rounded-2xl border border-slate-200/90 shadow-2xs" />
          )}
        </div>

        {/* Programme Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Degree Level Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isPhd
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}
            >
              <GraduationCap className="h-3 w-3" />
              {isPhd ? "PhD / Doctorate" : "Master's Degree"}
            </span>

            {typeof prog.facultyCount === "number" && prog.facultyCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Users className="h-3 w-3 text-indigo-600" />
                {prog.facultyCount.toLocaleString()} Faculty Linked
              </span>
            )}

            {prog.applicationStatus === "open" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Admissions Open
              </span>
            )}

            {prog.fundingAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Funding Available
              </span>
            )}
          </div>

          {/* Programme Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug">
            {prog.title}
          </h3>

          {/* Institution & Location */}
          <div className="flex items-center gap-3.5 text-xs text-slate-600 pt-0.5 flex-wrap">
            <span className="font-semibold text-slate-800 truncate max-w-[320px]">
              {prog.institutionName}
            </span>

            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{prog.location}</span>
            </div>

            {prog.nextDeadline && (
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Deadline: {prog.nextDeadline}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Criteria & Badges Grid */}
      <div className="flex flex-wrap items-center gap-2 pt-4 pb-3 my-3 border-t border-slate-100">
        {/* Tuition Chip */}
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isTuitionFree
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-50 text-slate-700 border border-slate-200"
          }`}
        >
          <DollarSign className="h-3.5 w-3.5 shrink-0" />
          <span>{prog.tuitionText || "Tuition not reported"}</span>
        </div>

        {/* IELTS Requirement */}
        {prog.requirements.ielts && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>IELTS {prog.requirements.ielts}</span>
          </div>
        )}

        {/* TOEFL Requirement */}
        {prog.requirements.toefl && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>TOEFL {prog.requirements.toefl}</span>
          </div>
        )}

        {/* GRE Requirement */}
        {prog.requirements.greRequired && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>GRE Required</span>
          </div>
        )}
        {/* Faculty Count Chip */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>{typeof prog.facultyCount === "number" && prog.facultyCount > 0 ? `${prog.facultyCount.toLocaleString()} Faculty` : "Faculty not listed"}</span>
        </div>
      </div>

      {/* Bottom Actions Row: Official Page Link & Related Professors Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          {prog.officialUrl ? (
            <a
              href={prog.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <span>Official Programme Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-xs text-slate-400">Official site sourced</span>
          )}
        </div>

        {/* Direct Link to Related Professors for this Institution */}
        {prog.institutionId ? (
          <Link
            href={`/professors?institutionId=${prog.institutionId}&universityName=${encodeURIComponent(prog.institutionName)}`}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Users className="h-4 w-4" />
            <span>Related Professors {typeof prog.facultyCount === "number" && prog.facultyCount > 0 ? `(${prog.facultyCount})` : ""}</span>
          </Link>
        ) : (
          <Link
            href="/professors"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Users className="h-4 w-4" />
            <span>Browse Faculty</span>
          </Link>
        )}
      </div>
    </div>
  );
}
