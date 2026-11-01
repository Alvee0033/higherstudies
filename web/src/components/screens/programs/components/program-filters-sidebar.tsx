import * as React from "react";
import { Search, GraduationCap, Globe2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { countryName } from "@/lib/student-api";

export interface ProgramFiltersSidebarProps {
  countries?: { code: string; count: number }[];
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  degreeLevel: string;
  onDegreeLevelChange: (val: string) => void;
  selectedCountry: string;
  onSelectedCountryChange: (val: string) => void;
  mobileFilterOpen: boolean;
  sidebarHidden: boolean;
  onToggleSidebarHidden: () => void;
  onClearAll: () => void;
}

export function ProgramFiltersSidebar({
  countries = [],
  searchQuery,
  onSearchQueryChange,
  degreeLevel,
  onDegreeLevelChange,
  selectedCountry,
  onSelectedCountryChange,
  mobileFilterOpen,
  sidebarHidden,
  onToggleSidebarHidden,
  onClearAll,
}: ProgramFiltersSidebarProps) {
  const [degreeOpen, setDegreeOpen] = React.useState(true);
  const [locationOpen, setLocationOpen] = React.useState(true);

  return (
    <aside
      className={`${
        mobileFilterOpen ? "block" : "hidden"
      } lg:block w-full lg:w-[280px] xl:w-[300px] shrink-0 space-y-4 pr-1 pb-4`}
    >
      {/* Title block */}
      <div className="text-left space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading leading-tight">
          Find Programmes
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          Explore graduate degrees, scholarships, and admission criteria.
        </p>
      </div>

      {/* Filters Title + Hide Button */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
        <div className="flex items-center gap-2">
          {(searchQuery || degreeLevel !== "all" || selectedCountry) && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
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
      </div>

      {!sidebarHidden && (
        <div className="space-y-4">
          {/* Keyword Search */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-2 shadow-2xs">
            <label htmlFor="program-search" className="block text-xs font-bold text-slate-700">
              Field or Keyword
            </label>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="program-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="e.g. Computer Science, MBA, Biotech..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs"
              />
            </div>
          </div>

          {/* Degree Level Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setDegreeOpen(!degreeOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <span>Degree Level</span>
              </div>
              <ChevronUp
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  degreeOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {degreeOpen && (
              <div className="space-y-2 pt-1 text-xs font-medium text-slate-700">
                {[
                  { value: "all", label: "All Degrees" },
                  { value: "masters", label: "Master's Degrees" },
                  { value: "phd", label: "PhD / Doctorate" },
                ].map((d) => (
                  <label
                    key={d.value}
                    className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="degree"
                      value={d.value}
                      checked={degreeLevel === d.value}
                      onChange={(e) => onDegreeLevelChange(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Location Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setLocationOpen(!locationOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-indigo-600" />
                <span>Study Country</span>
              </div>
              <ChevronUp
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  locationOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {locationOpen && (
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => onSelectedCountryChange(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#1476F2] appearance-none cursor-pointer"
                  >
                    <option value="">All Countries</option>
                    {countries.map(({ code, count }) => (
                      <option key={code} value={code}>
                        {countryName(code)} ({count})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
