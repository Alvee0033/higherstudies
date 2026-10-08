import * as React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export interface UniversityMobileHeaderProps {
  totalResults?: number;
  onToggleMobileFilter: () => void;
}

export function UniversityMobileHeader({
  totalResults = 120,
  onToggleMobileFilter,
}: UniversityMobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between pb-2">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-heading">Find Universities</h1>
        <p className="text-xs text-slate-500">{totalResults} Results Found</p>
      </div>
      <button
        type="button"
        onClick={onToggleMobileFilter}
        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#5D3FD3]" />
        <span>Filters (12)</span>
      </button>
    </div>
  );
}

export interface UniversityResultsHeaderProps {
  totalResults?: number;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onClearAll: () => void;
}

export function UniversityResultsHeader({
  totalResults = 120,
  sortBy,
  onSortByChange,
  onClearAll,
}: UniversityResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-normal text-[#5D3FD3] hover:underline cursor-pointer"
        >
          Clear All
        </button>
        <div className="hidden lg:flex h-8 px-3.5 rounded-lg bg-[#E8E4FF] border border-[#C7D2FE] items-center text-xs font-medium text-[#5D3FD3]">
          {totalResults} Results Found
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-xs text-slate-500">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="h-8 pl-3 pr-7 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none cursor-pointer appearance-none"
          >
            <option>Best Match</option>
            <option>QS Rank: Low to High</option>
            <option>Tuition: Low to High</option>
            <option>Acceptance Rate</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
