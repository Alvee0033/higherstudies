"use client";

import * as React from "react";
import { useApi } from "@/hooks/use-api";
import {useSaved} from "@/hooks/use-saved";
import { useSearchParams, useRouter } from "next/navigation";
import {countryName,placeholderAvatar,safeUrl,type CatalogueRecord,type Page} from "@/lib/student-api";
import {UniversityPagination} from "../universities/components/university-pagination";
import type {Professor} from "./professor-types";
import { ProfessorRanksState, ProfessorOpeningsState } from "./professor-types";
import { ProfessorInstitutionHeader } from "./components/professor-institution-header";
import { ProfessorSearchControls, ProfessorTab } from "./components/professor-search-controls";
import { ProfessorCard } from "./components/professor-card";
import { buildFacultySearchParams } from "@/lib/faculty-search.mjs";

import { ProfessorFiltersSidebar } from "./components/professor-filters-sidebar";

export function ProfessorListView() {
  const query = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<ProfessorTab>("all");
  const [searchQuery, setSearchQuery] = React.useState(query.get("q") || "");
  const [filterSearch, setFilterSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All Departments");
  const [selectedArea, setSelectedArea] = React.useState("All Research Areas");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = React.useState("Name");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const saved = useSaved();

  const queryInstId = query.get("institutionId") || "";
  const [prevQueryInstId, setPrevQueryInstId] = React.useState(queryInstId);
  const [institutionId, setInstitutionId] = React.useState(queryInstId);
  const [country, setCountry] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  if (queryInstId !== prevQueryInstId) {
    setPrevQueryInstId(queryInstId);
    setInstitutionId(queryInstId);
    setCurrentPage(1);
  }

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
  const [onlyActiveResearchers, setOnlyActiveResearchers] = React.useState(false);

  const facets=useApi<{data:{countries:{code:string;count:number}[];institutions:{id:string;name:string}[];topics:string[];departments:string[]}}>('/v1/faculty/facets');
  const params=buildFacultySearchParams({page:currentPage,activeTab,sortBy,searchQuery,filterSearch,institutionId,country,selectedDept,selectedArea,ranks,hIndex,citationCount});
  const result=useApi<Page<CatalogueRecord>>(`/v1/faculty?${params}`);
  const total=result.data?.page.total??0;
  const professors:Professor[]=(result.data?.data??[]).map(row=>({id:row.id,name:row.name||'Unnamed researcher',verified:!!row.verified_at,title:row.title||row.institution_name||'Title not reported',department:row.academic_unit||'Not reported',topics:row.research_topics??[],phd:row.institution_name||'Affiliation not reported',institutionOfficialUrl:safeUrl(row.institution_official_url),hIndex:row.research_metadata?.hIndex??'—',citations:String(row.research_metadata?.citedByCount??'—'),publications:row.research_metadata?.worksCount??'—',yearsAtMit:'—',currentStudents:'—',openings:'Not reported',avatar:placeholderAvatar}));
  const toggleSaveProfessor=(id:string)=>void saved.toggle('faculty',id);

  const institutionNameFromQuery = query.get("universityName") || "";
  const currentInstitutionName = facets.data?.data.institutions.find(row=>row.id===institutionId)?.name || institutionNameFromQuery || (institutionId ? result.data?.data[0]?.institution_name : undefined);

  const handleRankChange = (key: keyof ProfessorRanksState, val: boolean) => {
    setRanks((prev) => ({ ...prev, [key]: val }));
  };

  const handleOpeningChange = (key: keyof ProfessorOpeningsState, val: boolean) => {
    setOpenings((prev) => ({ ...prev, [key]: val }));
  };

  const handleClearInstitution = () => {
    setInstitutionId("");
    setCurrentPage(1);
    if (query.get("institutionId") || query.get("universityName")) {
      const nextParams = new URLSearchParams(query.toString());
      nextParams.delete("institutionId");
      nextParams.delete("universityName");
      router.push(`/professors${nextParams.toString() ? `?${nextParams.toString()}` : ""}`);
    }
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
    setOnlyActiveResearchers(false);
    handleClearInstitution();
    setCountry("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* 2-Column Section: Left Main Content + Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Main Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* Institution Header (Breadcrumb + University Card + Stats/Links) */}
          <ProfessorInstitutionHeader
            institutionName={currentInstitutionName}
            total={total}
            institutionId={institutionId}
            institutionUrl={result.data?.data[0]?.institution_official_url}
            isSavedUniversity={saved.has("institutions",institutionId)}
            onToggleSaveUniversity={()=>{if(institutionId)void saved.toggle("institutions",institutionId);}}
            onClearInstitution={handleClearInstitution}
          />

          {/* Sub Toolbar (Tabs + Search + Sort + View Mode) */}
          <ProfessorSearchControls
            total={total}
            activeTab={activeTab}
            onTabChange={value=>{setActiveTab(value);setCurrentPage(1);if(value==='department')setMobileFilterOpen(true);if(value==='research')setMobileFilterOpen(true);}}
            mobileFilterOpen={mobileFilterOpen}
            onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
            searchQuery={searchQuery}
            onSearchQueryChange={value=>{setSearchQuery(value);setCurrentPage(1);}}
            sortBy={sortBy}
            onSortByChange={value=>{setSortBy(value);setCurrentPage(1);}}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex flex-wrap gap-3">
           <select aria-label="Country" value={country} onChange={e=>{setCountry(e.target.value);setCurrentPage(1);}} className="rounded-xl border border-slate-200 bg-white p-2 text-xs"><option value="">All countries</option>{facets.data?.data.countries.map(row=><option key={row.code} value={row.code}>{countryName(row.code)} ({row.count})</option>)}</select>
           <select aria-label="Institution" value={institutionId} onChange={e=>{setInstitutionId(e.target.value);setCurrentPage(1);}} className="rounded-xl border border-slate-200 bg-white p-2 text-xs max-w-full"><option value="">All institutions</option>{facets.data?.data.institutions.map(row=><option key={row.id} value={row.id}>{row.name}</option>)}</select>
          </div>
          {result.loading&&<p role="status" className="text-sm text-slate-500">Loading faculty…</p>}
          {(result.error||saved.error)&&<p role="alert" className="text-sm text-rose-600">{result.error||saved.error} <button onClick={result.reload}>Retry</button></p>}
          {!result.loading&&!result.error&&!professors.length&&<p className="p-6 bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">No faculty match these filters.</p>}
          {/* Professor Cards List */}
          <div className={viewMode==='grid'?"grid grid-cols-1 xl:grid-cols-2 gap-4":"space-y-4"}>
            {professors.map((prof) => (
              <ProfessorCard
                key={prof.id}
                professor={prof}
                isSaved={saved.has('faculty',prof.id)}
                onToggleSave={toggleSaveProfessor}
              />
            ))}
          </div>

          {/* Bottom Pagination */}
          <UniversityPagination
            currentPage={currentPage}
            totalPages={Math.max(1,Math.ceil(total/20))}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Column: Filter Professors Panel */}
        <ProfessorFiltersSidebar
          departments={facets.data?.data.departments}
          areas={facets.data?.data.topics}
          mobileFilterOpen={mobileFilterOpen}
          onCloseMobileFilter={() => setMobileFilterOpen(false)}
          filterSearch={filterSearch}
          onFilterSearchChange={value=>{setFilterSearch(value);setCurrentPage(1);}}
          selectedDept={selectedDept}
          onSelectedDeptChange={value=>{setSelectedDept(value);setCurrentPage(1);}}
          selectedArea={selectedArea}
          onSelectedAreaChange={value=>{setSelectedArea(value);setCurrentPage(1);}}
          ranks={ranks}
          onRankChange={handleRankChange}
          openings={openings}
          onOpeningChange={handleOpeningChange}
          yearsAtMit={yearsAtMit}
          onYearsAtMitChange={setYearsAtMit}
          hIndex={hIndex}
          onHIndexChange={value=>{setHIndex(value);setCurrentPage(1);}}
          citationCount={citationCount}
          onCitationCountChange={value=>{setCitationCount(value);setCurrentPage(1);}}
          onlyActiveResearchers={onlyActiveResearchers}
          onToggleActiveResearchers={() => setOnlyActiveResearchers(!onlyActiveResearchers)}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
