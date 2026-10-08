import * as React from "react";
import { ChevronUp, Bookmark } from "lucide-react";
import { FilterAcademicPreferences } from "./filter-academic-preferences";
import { FilterLocationPreferences } from "./filter-location-preferences";
import { FilterAccordionSection } from "./filter-accordion-section";

export interface UniversityFiltersSidebarProps {
  mobileFilterOpen: boolean;
  sidebarHidden: boolean;
  onToggleSidebarHidden: () => void;
  // Academic
  academicOpen: boolean;
  onToggleAcademicOpen: () => void;
  degreeLevel: string;
  onDegreeLevelChange: (val: string) => void;
  fieldOfStudy: string;
  onFieldOfStudyChange: (val: string) => void;
  specialization: string;
  onSpecializationChange: (val: string) => void;
  gpaMin: number;
  onGpaMinChange: (val: number) => void;
  ieltsMin: number;
  onIeltsMinChange: (val: number) => void;
  // Location
  locationOpen: boolean;
  onToggleLocationOpen: () => void;
  studyDestination: string;
  onStudyDestinationChange: (val: string) => void;
  selectedCountries: string[];
  onRemoveCountry: (country: string) => void;
  excludeCountry: string;
  onExcludeCountryChange: (val: string) => void;
  // Accordions
  financialOpen: boolean;
  onToggleFinancialOpen: () => void;
  universityPrefOpen: boolean;
  onToggleUniversityPrefOpen: () => void;
  programPrefOpen: boolean;
  onToggleProgramPrefOpen: () => void;
}

export function UniversityFiltersSidebar({
  mobileFilterOpen,
  sidebarHidden,
  onToggleSidebarHidden,
  academicOpen,
  onToggleAcademicOpen,
  degreeLevel,
  onDegreeLevelChange,
  fieldOfStudy,
  onFieldOfStudyChange,
  specialization,
  onSpecializationChange,
  gpaMin,
  onGpaMinChange,
  ieltsMin,
  onIeltsMinChange,
  locationOpen,
  onToggleLocationOpen,
  studyDestination,
  onStudyDestinationChange,
  selectedCountries,
  onRemoveCountry,
  excludeCountry,
  onExcludeCountryChange,
  financialOpen,
  onToggleFinancialOpen,
  universityPrefOpen,
  onToggleUniversityPrefOpen,
  programPrefOpen,
  onToggleProgramPrefOpen,
}: UniversityFiltersSidebarProps) {
  return (
    <aside
      className={`${
        mobileFilterOpen ? "block" : "hidden"
      } lg:block w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-3 pr-1 pb-4`}
    >
      {/* Header Title block */}
      <div className="text-left space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading leading-tight">
          Find Universities
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          Discover universities that match your academic profile and preferences
        </p>
      </div>

      {/* Filters Title + Hide Button */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={onToggleSidebarHidden}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{sidebarHidden ? "Show" : "Hide"}</span>
          <ChevronUp
            className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
              sidebarHidden ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {!sidebarHidden && (
        <div className="space-y-2.5">
          {/* 1. Academic Preferences Box */}
          <FilterAcademicPreferences
            isOpen={academicOpen}
            onToggle={onToggleAcademicOpen}
            degreeLevel={degreeLevel}
            onDegreeLevelChange={onDegreeLevelChange}
            fieldOfStudy={fieldOfStudy}
            onFieldOfStudyChange={onFieldOfStudyChange}
            specialization={specialization}
            onSpecializationChange={onSpecializationChange}
            gpaMin={gpaMin}
            onGpaMinChange={onGpaMinChange}
            ieltsMin={ieltsMin}
            onIeltsMinChange={onIeltsMinChange}
          />

          {/* 2. Location Preferences Box */}
          <FilterLocationPreferences
            isOpen={locationOpen}
            onToggle={onToggleLocationOpen}
            studyDestination={studyDestination}
            onStudyDestinationChange={onStudyDestinationChange}
            selectedCountries={selectedCountries}
            onRemoveCountry={onRemoveCountry}
            excludeCountry={excludeCountry}
            onExcludeCountryChange={onExcludeCountryChange}
          />

          {/* 3. Financial Preferences Box (Accordion) */}
          <FilterAccordionSection
            title="Financial Preferences"
            isOpen={financialOpen}
            onToggle={onToggleFinancialOpen}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>Full Tuition Waiver</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>Assistantship (RA/TA) Available</span>
            </label>
          </FilterAccordionSection>

          {/* 4. University Preferences Box (Accordion) */}
          <FilterAccordionSection
            title="University Preferences"
            isOpen={universityPrefOpen}
            onToggle={onToggleUniversityPrefOpen}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>Top 100 QS Ranked</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>High Research Output (R1)</span>
            </label>
          </FilterAccordionSection>

          {/* 5. Program Preferences Box (Accordion) */}
          <FilterAccordionSection
            title="Program Preferences"
            isOpen={programPrefOpen}
            onToggle={onToggleProgramPrefOpen}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>Fall 2025 Intake</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
              <span>Spring 2026 Intake</span>
            </label>
          </FilterAccordionSection>

          {/* Sidebar Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              className="w-full h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-slate-400" />
              <span>Save Search</span>
            </button>
            <button
              type="button"
              className="w-full h-10 rounded-lg bg-[#5D3FD3] hover:bg-[#4E34B5] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              Apply Filters (12)
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
