import * as React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export interface ProgramMobileHeaderProps {
  totalResults?: number;
  onToggleMobileFilter: () => void;
}

export function ProgramMobileHeader({
  totalResults = 0,
  onToggleMobileFilter,
}: ProgramMobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between pb-2">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-heading">Programmes</h1>
        <p className="text-xs text-slate-500">{totalResults.toLocaleString()} Degrees Available</p>
      </div>
      <button
        type="button"
        onClick={onToggleMobileFilter}
        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#1476F2]" />
        <span>Filters</span>
      </button>
    </div>
  );
}

export interface ProgramResultsHeaderProps {
  totalResults?: number;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onClearAll: () => void;
}

export function ProgramResultsHeader({
  totalResults = 0,
  sortBy,
  onSortByChange,
  onClearAll,
}: ProgramResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex h-8 px-3.5 rounded-lg bg-indigo-50 border border-indigo-100 items-center text-xs font-bold text-[#1476F2]">
          {totalResults.toLocaleString()} Programmes Found
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-xs text-slate-500">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="h-8 pl-3 pr-7 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="newest">Recently Published</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
            <option value="country">Country</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
