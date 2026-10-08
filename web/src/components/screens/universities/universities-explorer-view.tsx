"use client";

import * as React from "react";
import { UNIVERSITIES } from "./university-data";
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
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({ mit: true });

  // Accordion state
  const [academicOpen, setAcademicOpen] = React.useState(true);
  const [locationOpen, setLocationOpen] = React.useState(true);
  const [financialOpen, setFinancialOpen] = React.useState(false);
  const [universityPrefOpen, setUniversityPrefOpen] = React.useState(false);
  const [programPrefOpen, setProgramPrefOpen] = React.useState(false);

  // Form values
  const [degreeLevel, setDegreeLevel] = React.useState("Master's");
  const [fieldOfStudy, setFieldOfStudy] = React.useState("Computer Science");
  const [specialization, setSpecialization] = React.useState("");
  const [gpaMin, setGpaMin] = React.useState(3.0);
  const [ieltsMin, setIeltsMin] = React.useState(7.0);
  const [studyDestination, setStudyDestination] = React.useState("Any Country");
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([
    "United States",
    "Canada",
  ]);
  const [excludeCountry, setExcludeCountry] = React.useState("");
  const [sortBy, setSortBy] = React.useState("Best Match");
  const [currentPage, setCurrentPage] = React.useState(1);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeCountry = (c: string) => {
    setSelectedCountries((prev) => prev.filter((item) => item !== c));
  };

  const clearAllFilters = () => {
    setDegreeLevel("Master's");
    setFieldOfStudy("Computer Science");
    setSpecialization("");
    setGpaMin(3.0);
    setIeltsMin(7.0);
    setStudyDestination("Any Country");
    setSelectedCountries(["United States", "Canada"]);
    setExcludeCountry("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Top Controls Bar */}
      <UniversityMobileHeader
        totalResults={120}
        onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
      />

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Left Filters Sidebar */}
        <UniversityFiltersSidebar
          mobileFilterOpen={mobileFilterOpen}
          sidebarHidden={sidebarHidden}
          onToggleSidebarHidden={() => setSidebarHidden(!sidebarHidden)}
          academicOpen={academicOpen}
          onToggleAcademicOpen={() => setAcademicOpen(!academicOpen)}
          degreeLevel={degreeLevel}
          onDegreeLevelChange={setDegreeLevel}
          fieldOfStudy={fieldOfStudy}
          onFieldOfStudyChange={setFieldOfStudy}
          specialization={specialization}
          onSpecializationChange={setSpecialization}
          gpaMin={gpaMin}
          onGpaMinChange={setGpaMin}
          ieltsMin={ieltsMin}
          onIeltsMinChange={setIeltsMin}
          locationOpen={locationOpen}
          onToggleLocationOpen={() => setLocationOpen(!locationOpen)}
          studyDestination={studyDestination}
          onStudyDestinationChange={setStudyDestination}
          selectedCountries={selectedCountries}
          onRemoveCountry={removeCountry}
          excludeCountry={excludeCountry}
          onExcludeCountryChange={setExcludeCountry}
          financialOpen={financialOpen}
          onToggleFinancialOpen={() => setFinancialOpen(!financialOpen)}
          universityPrefOpen={universityPrefOpen}
          onToggleUniversityPrefOpen={() => setUniversityPrefOpen(!universityPrefOpen)}
          programPrefOpen={programPrefOpen}
          onToggleProgramPrefOpen={() => setProgramPrefOpen(!programPrefOpen)}
        />

        {/* Right University Cards Area */}
        <section className="flex-1 w-full space-y-4 min-w-0">
          {/* Top Results Header: Clear All, 120 Results Found, Sort by */}
          <UniversityResultsHeader
            totalResults={120}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onClearAll={clearAllFilters}
          />

          {/* Cards List */}
          <div className="space-y-4">
            {UNIVERSITIES.map((uni, idx) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                isFirst={idx === 0}
                isFavorite={!!favorites[uni.id]}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Pagination Controls matching Figma */}
          <UniversityPagination
            currentPage={currentPage}
            totalPages={12}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </div>
  );
}
