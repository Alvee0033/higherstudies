"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { useSaved } from "@/hooks/use-saved";
import { useCampusImages } from "@/hooks/use-campus-images";
import { countryName, safeUrl, type CatalogueRecord, type Page } from "@/lib/student-api";
import type { ProgramItem } from "./program-types";
import { ProgramCard } from "./components/program-card";
import { ProgramFiltersSidebar } from "./components/program-filters-sidebar";
import {
  ProgramMobileHeader,
  ProgramResultsHeader,
} from "./components/program-results-header";
import { UniversityPagination } from "../universities/components/university-pagination";
import { Building2, Users, X } from "lucide-react";

export function ProgramsExplorerView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const saved = useSaved();

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [sidebarHidden, setSidebarHidden] = React.useState(false);

  // Institution filter from query parameter
  const institutionId = searchParams.get("institutionId") || "";
  const universityName = searchParams.get("universityName") || "";

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const [degreeLevel, setDegreeLevel] = React.useState(searchParams.get("degree") || "all");
  const [selectedCountry, setSelectedCountry] = React.useState(searchParams.get("country") || "");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch facets (countries with count)
  const facets = useApi<{ data: { countries: { code: string; count: number }[] } }>("/v1/programmes/facets");

  // Construct query parameters
  const params = new URLSearchParams({
    limit: "20",
    offset: String((currentPage - 1) * 20),
    sort: sortBy,
  });
  if (institutionId) params.set("institutionId", institutionId);
  if (searchQuery.trim()) params.set("q", searchQuery.trim());
  if (degreeLevel && degreeLevel !== "all") params.set("degree", degreeLevel);
  if (selectedCountry) params.set("country", selectedCountry);

  // Fetch published programmes
  const result = useApi<Page<CatalogueRecord>>(`/v1/programmes?${params}`);
  const total = result.data?.page.total ?? 0;

  const programs: ProgramItem[] = (result.data?.data ?? []).map((row) => {
    const sourceScores = Array.isArray(row.source_details?.englishRequirements)
      ? (row.source_details.englishRequirements as { type: string; score: number }[])
      : [];
    const officialIelts = row.requirements?.find((r) => r.type === "ielts");
    const sourceIelts = sourceScores.find((item) => item.type?.toUpperCase().includes("IELTS"));
    const officialToefl = row.requirements?.find((r) => r.type === "toefl");
    const sourceToefl = sourceScores.find((item) => item.type?.toUpperCase().includes("TOEFL"));
    const greReq = row.requirements?.some((r) => r.type === "gre" && r.state === "required");
    const greWaived = row.requirements?.some((r) => r.type === "gre" && r.state === "waived");

    const tuitionFormatted = row.tuition?.length
      ? row.tuition
          .map((f) => `${f.amount ?? "Not reported"} ${f.currency ?? ""} / ${f.period ?? f.unit ?? "year"}`)
          .join("; ")
      : "";

    return {
      id: row.id,
      title: row.title || "Untitled Programme",
      degree: row.degree || "masters",
      institutionId: row.institution_id,
      institutionName: row.institution_name || universityName || "University",
      countryCode: row.country_code,
      city: row.city,
      location: [row.city, countryName(row.country_code)].filter(Boolean).join(", ") || "Global",
      academicUnit: row.academic_unit,
      institutionOfficialUrl: safeUrl(row.institution_official_url),
      language: row.language,
      applicationStatus: row.application_status,
      admissionNote: row.admission_note,
      tuitionText: tuitionFormatted,
      requirements: {
        ielts: officialIelts?.value_number ? String(officialIelts.value_number) : sourceIelts?.score ? String(sourceIelts.score) : undefined,
        toefl: officialToefl?.value_number ? String(officialToefl.value_number) : sourceToefl?.score ? String(sourceToefl.score) : undefined,
        greRequired: greReq,
        greWaived: greWaived,
        all: row.requirements ?? [],
      },
      fundingAvailable: Array.isArray(row.funding) && row.funding.length > 0,
      fundingOpportunities: Array.isArray(row.funding) ? (row.funding as { id: string; title: string; provider?: string }[]) : [],
      nextDeadline: row.next_deadline,
      officialUrl: safeUrl(row.official_url),
      verifiedAt: row.verified_at,
      facultyCount: typeof row.faculty_count === "number" ? row.faculty_count : 0,
    };
  });

  const campusImages = useCampusImages(programs.map((program) => program.institutionName));

  const toggleFavorite = (id: string) => void saved.toggle("programmes", id);

  const clearUniversityFilter = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("institutionId");
    nextParams.delete("universityName");
    router.push(`/programs${nextParams.toString() ? `?${nextParams.toString()}` : ""}`);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setDegreeLevel("all");
    setSelectedCountry("");
    setSortBy("newest");
    setCurrentPage(1);
    if (institutionId) {
      clearUniversityFilter();
    }
  };

  const currentInstitutionName = universityName || (programs[0]?.institutionName ?? "Selected Institution");

  return (
    <div className="w-full space-y-6">
      {/* Mobile Top Controls Bar */}
      <ProgramMobileHeader
        totalResults={total}
        onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
      />

      {/* University Context Banner when institutionId is active */}
      {institutionId && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Institution Filter Active
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                  {currentInstitutionName}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing available graduate programmes at this university
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/professors?institutionId=${institutionId}&universityName=${encodeURIComponent(currentInstitutionName)}`}
                className="px-4 py-2 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>View University Professors</span>
              </Link>

              <button
                type="button"
                onClick={clearUniversityFilter}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>All Universities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Left Filters Sidebar */}
        <ProgramFiltersSidebar
          countries={facets.data?.data.countries}
          searchQuery={searchQuery}
          onSearchQueryChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          degreeLevel={degreeLevel}
          onDegreeLevelChange={(val) => {
            setDegreeLevel(val);
            setCurrentPage(1);
          }}
          selectedCountry={selectedCountry}
          onSelectedCountryChange={(val) => {
            setSelectedCountry(val);
            setCurrentPage(1);
          }}
          mobileFilterOpen={mobileFilterOpen}
          sidebarHidden={sidebarHidden}
          onToggleSidebarHidden={() => setSidebarHidden(!sidebarHidden)}
          onClearAll={clearAllFilters}
        />

        {/* Right Programme Cards Area */}
        <section className="flex-1 w-full space-y-4 min-w-0">
          <ProgramResultsHeader
            totalResults={total}
            sortBy={sortBy}
            onSortByChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            onClearAll={clearAllFilters}
          />

          {result.loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-sm text-slate-500 shadow-2xs">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
              <span>Loading programmes…</span>
            </div>
          )}

          {(result.error || saved.error) && (
            <div role="alert" className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-sm text-rose-700">
              <p className="font-bold">Error loading programmes</p>
              <p className="mt-1">{result.error || saved.error}</p>
              <button
                type="button"
                onClick={result.reload}
                className="mt-3 px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!result.loading && !result.error && programs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900">No programmes found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published programmes match your current filters. Try relaxing criteria or clearing the active university.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-4">
            {programs.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                campusImage={campusImages[prog.institutionName]}
                isFavorite={saved.has("programmes", prog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {total > 20 && (
            <UniversityPagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(total / 20))}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </div>
    </div>
  );
}
