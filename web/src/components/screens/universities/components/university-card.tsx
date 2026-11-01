import * as React from "react";
import Link from "next/link";
import type { CampusImage } from "@/hooks/use-campus-images";
import { MapPin, Heart, ExternalLink, BookOpen, Users, CheckCircle2 } from "lucide-react";
import { UniversityLogo } from "@/components/ui/university-logo";
import { cn } from "@/lib/utils";
import { UniversityItem } from "../university-types";

export interface UniversityCardProps {
  university: UniversityItem;
  isFirst?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  campusImage?: CampusImage | null;
}

export function UniversityCard({
  university: uni,
  isFirst = false,
  isFavorite = false,
  onToggleFavorite,
  campusImage,
}: UniversityCardProps) {
  return (
    <div
      className={cn(
        "client-university-card group flex flex-col h-full bg-white rounded-2xl border transition-all duration-200 text-left overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-300",
        isFirst
          ? "border-indigo-400/80 ring-1 ring-indigo-500/20"
          : "border-slate-200/90"
      )}
    >
      {/* 1. Consistent Top Banner (Fixed height on every card so grid never misaligns) */}
      <div className="relative h-28 sm:h-32 w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden shrink-0">
        {campusImage?.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campusImage.url}
              alt={uni.name}
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            {campusImage.artist && (
              <span className="absolute bottom-1.5 right-2 text-[9px] text-white/70 max-w-[140px] truncate bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {campusImage.artist}
              </span>
            )}
          </>
        ) : (
          <>
            {/* Beautiful instant dark academic pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
            <svg
              className="absolute inset-0 h-full w-full opacity-10 stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
            >
              <pattern id={`pat-${uni.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill={`url(#pat-${uni.id})`} />
            </svg>
            <div className="absolute right-3 -bottom-1 text-5xl font-black text-white/5 select-none pointer-events-none tracking-tighter">
              {uni.name.slice(0, 3).toUpperCase()}
            </div>
          </>
        )}

        {/* Favorite Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(uni.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500 rounded-full shadow-xs backdrop-blur-xs transition-all cursor-pointer z-10"
          aria-label="Save university"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-[#EF4444] text-[#EF4444]" : "text-slate-500"
            )}
          />
        </button>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5">
        <div>
          {/* Logo overlapping banner top */}
          <div className="-mt-9 sm:-mt-10 mb-2 flex items-end justify-between gap-2">
            <div className="p-1 bg-white rounded-2xl shadow-xs border border-slate-200/90 inline-block shrink-0">
              <UniversityLogo
                name={uni.name}
                url={uni.officialUrl}
                size={48}
                className="w-12 h-12 rounded-xl"
              />
            </div>
            {uni.verifiedAt ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                Source listed
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-base font-bold text-slate-900 font-heading leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors"
            title={uni.name}
          >
            {uni.name}
          </h3>

          {/* Location & Website */}
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 gap-2">
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium truncate">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{uni.location}</span>
            </span>

            {uni.officialUrl && (
              <a
                href={uni.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline font-semibold shrink-0"
              >
                <span>Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* 3. Metrics Badges (Neat 2-Column Grid) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700 min-w-0">
            <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] font-medium text-slate-400 leading-tight">Programs</p>
              <p className="text-xs font-bold text-slate-800 truncate">
                {uni.programmeCount > 0
                  ? `${uni.programmeCount.toLocaleString()} listed`
                  : "Cataloging"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100/80 text-xs font-semibold text-indigo-900 min-w-0">
            <Users className="h-4 w-4 text-indigo-600 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] font-medium text-indigo-400 leading-tight">Faculty</p>
              <p className="text-xs font-bold text-indigo-950 truncate">
                {uni.facultyCount > 0
                  ? `${uni.facultyCount.toLocaleString()} professors`
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons (Two equal columns at bottom of card, always aligned) */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-auto">
          <Link
            href={`/programs?institutionId=${uni.id}&universityName=${encodeURIComponent(uni.name)}`}
            className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-center"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Programs</span>
          </Link>

          <Link
            href={`/professors?institutionId=${uni.id}&universityName=${encodeURIComponent(uni.name)}`}
            className="w-full px-2.5 py-2.5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer text-center"
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Faculty {uni.facultyCount > 0 ? `(${uni.facultyCount})` : ""}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
