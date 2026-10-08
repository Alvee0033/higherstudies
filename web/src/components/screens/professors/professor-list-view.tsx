"use client";

import * as React from "react";
import { PROFESSORS_DATA } from "./professor-data";
import { ProfessorRanksState, ProfessorOpeningsState } from "./professor-types";
import { ProfessorInstitutionHeader } from "./components/professor-institution-header";
import { ProfessorSearchControls, ProfessorTab } from "./components/professor-search-controls";
import { ProfessorCard } from "./components/professor-card";
import { ProfessorPagination } from "./components/professor-pagination";
import { ProfessorFiltersSidebar } from "./components/professor-filters-sidebar";

export function ProfessorListView() {
  const [activeTab, setActiveTab] = React.useState<ProfessorTab>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterSearch, setFilterSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All Departments");
  const [selectedArea, setSelectedArea] = React.useState("All Research Areas");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = React.useState("Relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [isSavedUniversity, setIsSavedUniversity] = React.useState(false);
  const [savedProfessors, setSavedProfessors] = React.useState<Record<string, boolean>>({});

  // Rank filters
  const [ranks, setRanks] = React.useState<ProfessorRanksState>({
    professor: false,
    assoc: false,
    assistant: false,
    lecturer: false,
  });

  // Openings filters
  const [openings, setOpenings] = React.useState<ProfessorOpeningsState>({
    phd: false,
    postdoc: false,
    researchAssociate: false,
  });

  // Sliders
  const [yearsAtMit, setYearsAtMit] = React.useState(40);
  const [hIndex, setHIndex] = React.useState(100);
  const [citationCount, setCitationCount] = React.useState(50000);
  const [onlyActiveResearchers, setOnlyActiveResearchers] = React.useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  const toggleSaveProfessor = (id: string) => {
    setSavedProfessors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRankChange = (key: keyof ProfessorRanksState, val: boolean) => {
    setRanks((prev) => ({ ...prev, [key]: val }));
  };

  const handleOpeningChange = (key: keyof ProfessorOpeningsState, val: boolean) => {
    setOpenings((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilterSearch("");
    setSelectedDept("All Departments");
    setSelectedArea("All Research Areas");
    setRanks({ professor: false, assoc: false, assistant: false, lecturer: false });
    setOpenings({ phd: false, postdoc: false, researchAssociate: false });
    setYearsAtMit(40);
    setHIndex(100);
    setCitationCount(50000);
    setOnlyActiveResearchers(true);
  };

  return (
    <div className="w-full">
      {/* 2-Column Section: Left Main Content + Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Main Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* Institution Header (Breadcrumb + MIT Card + 5 Stats) */}
          <ProfessorInstitutionHeader
            isSavedUniversity={isSavedUniversity}
            onToggleSaveUniversity={() => setIsSavedUniversity(!isSavedUniversity)}
          />

          {/* Sub Toolbar (Tabs + Search + Sort + View Mode) */}
          <ProfessorSearchControls
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mobileFilterOpen={mobileFilterOpen}
            onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Professor Cards List */}
          <div className="space-y-4">
            {PROFESSORS_DATA.map((prof) => (
              <ProfessorCard
                key={prof.id}
                professor={prof}
                isSaved={!!savedProfessors[prof.id]}
                onToggleSave={toggleSaveProfessor}
              />
            ))}
          </div>

          {/* Bottom Pagination */}
          <ProfessorPagination
            currentPage={currentPage}
            totalCount="1,247"
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Column: Filter Professors Panel */}
        <ProfessorFiltersSidebar
          mobileFilterOpen={mobileFilterOpen}
          onCloseMobileFilter={() => setMobileFilterOpen(false)}
          filterSearch={filterSearch}
          onFilterSearchChange={setFilterSearch}
          selectedDept={selectedDept}
          onSelectedDeptChange={setSelectedDept}
          selectedArea={selectedArea}
          onSelectedAreaChange={setSelectedArea}
          ranks={ranks}
          onRankChange={handleRankChange}
          openings={openings}
          onOpeningChange={handleOpeningChange}
          yearsAtMit={yearsAtMit}
          onYearsAtMitChange={setYearsAtMit}
          hIndex={hIndex}
          onHIndexChange={setHIndex}
          citationCount={citationCount}
          onCitationCountChange={setCitationCount}
          onlyActiveResearchers={onlyActiveResearchers}
          onToggleActiveResearchers={() => setOnlyActiveResearchers(!onlyActiveResearchers)}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
