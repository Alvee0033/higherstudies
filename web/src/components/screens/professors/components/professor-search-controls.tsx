import * as React from "react";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

export type ProfessorTab = "all" | "department" | "research" | "recent";

export interface ProfessorSearchControlsProps {
  activeTab: ProfessorTab;
  onTabChange: (tab: ProfessorTab) => void;
  mobileFilterOpen: boolean;
  onToggleMobileFilter: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export function ProfessorSearchControls({
  activeTab,
  onTabChange,
  mobileFilterOpen,
  onToggleMobileFilter,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
}: ProfessorSearchControlsProps) {
  return (
    <>
      {/* 3. Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 gap-2 overflow-x-auto">
        <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-semibold whitespace-nowrap">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`pb-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "all"
                ? "border-[#5D3FD3] text-[#5D3FD3]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All Professors (1,247)
          </button>
          <button
            type="button"
            onClick={() => onTabChange("department")}
            className={`pb-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "department"
                ? "border-[#5D3FD3] text-[#5D3FD3]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            By Department
          </button>
          <button
            type="button"
            onClick={() => onTabChange("research")}
            className={`pb-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "research"
                ? "border-[#5D3FD3] text-[#5D3FD3]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            By Research Area
          </button>
          <button
            type="button"
            onClick={() => onTabChange("recent")}
            className={`pb-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "recent"
                ? "border-[#5D3FD3] text-[#5D3FD3]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Recently Joined
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={onToggleMobileFilter}
          className="lg:hidden shrink-0 mb-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#5D3FD3]" />
          <span>Filters</span>
        </button>
      </div>

      {/* 4. Sub Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search professors..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]/20 focus:border-[#5D3FD3]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="Relevance">Relevance</option>
              <option value="H-Index">H-Index (Highest)</option>
              <option value="Citations">Citations</option>
              <option value="Openings">Most Openings</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === "grid" ? "bg-white shadow-2xs text-[#5D3FD3]" : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === "list" ? "bg-white shadow-2xs text-[#5D3FD3]" : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
