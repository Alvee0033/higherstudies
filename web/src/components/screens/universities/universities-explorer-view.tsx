"use client";

import * as React from "react";
import { useApi } from "@/hooks/use-api";
import { useSaved } from "@/hooks/use-saved";
import { useCampusImages } from "@/hooks/use-campus-images";
import { countryName, safeUrl, placeholderAvatar, type CatalogueRecord, type Page } from "@/lib/student-api";
import type { UniversityItem } from "./university-types";
import { UniversityCard } from "./components/university-card";
import { UniversityPagination } from "./components/university-pagination";
import { UniversityFiltersSidebar } from "./components/university-filters-sidebar";
import {
  UniversityMobileHeader,
  UniversityResultsHeader,
} from "./components/university-results-header";

export function UniversitiesExplorerView() {
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [sidebarHidden, setSidebarHidden] = React.useState(false);
  const saved = useSaved();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch institution facets (e.g., countries breakdown)
  const facets = useApi<{ data: { countries: { code: string; count: number }[] } }>("/v1/institutions/facets");

  // Construct query parameters
  const params = new URLSearchParams({
    limit: "20",
    offset: String((currentPage - 1) * 20),
    sort: sortBy,
  });
  if (searchQuery.trim()) params.set("q", searchQuery.trim());
  if (selectedCountry) params.set("country", selectedCountry);

  // Fetch published universities
  const result = useApi<Page<CatalogueRecord>>(`/v1/institutions?${params}`);
  const total = result.data?.page.total ?? 0;

  const universities: UniversityItem[] = (result.data?.data ?? []).map((row) => ({
    id: row.id,
    name: row.name || "Untitled University",
    countryCode: row.country_code,
    countryName: countryName(row.country_code),
    city: row.city,
    location: [row.city, countryName(row.country_code)].filter(Boolean).join(", ") || "Global",
    officialUrl: safeUrl(row.official_url),
    verifiedAt: row.verified_at,
    programmeCount: row.programme_count ?? 0,
    facultyCount: row.faculty_count ?? 0,
    evidenceUrl: row.evidence_url,
    sourceName: row.source_name,
    logo: placeholderAvatar,
  }));
  const campusImages = useCampusImages(universities.map((university) => university.name));

  const toggleFavorite = (id: string) => void saved.toggle("institutions", id);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCountry("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Top Controls Bar */}
      <UniversityMobileHeader
        totalResults={total}
        onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
      />

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Left Filters Sidebar */}
        <UniversityFiltersSidebar
          countries={facets.data?.data.countries}
          searchQuery={searchQuery}
          onSearchQueryChange={(val) => {
            setSearchQuery(val);
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

        {/* Right University Cards Area */}
        <section className="flex-1 w-full space-y-4 min-w-0">
          {/* Top Results Header: Count, Clear All, Sort by */}
          <UniversityResultsHeader
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
              <span>Loading universities directory…</span>
            </div>
          )}

          {(result.error || saved.error) && (
            <div role="alert" className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-sm text-rose-700">
              <p className="font-bold">Error loading universities</p>
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

          {!result.loading && !result.error && universities.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900">No universities found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published institutions match your current filter criteria. Try clearing search keywords or selecting another country.
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
          <div className="client-university-grid grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {universities.map((uni, idx) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                campusImage={campusImages[uni.name]}
                isFirst={idx === 0 && currentPage === 1}
                isFavorite={saved.has("institutions", uni.id)}
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
