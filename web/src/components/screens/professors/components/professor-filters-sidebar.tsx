import * as React from "react";
import { ProfessorRanksState, ProfessorOpeningsState } from "../professor-types";

export interface ProfessorFiltersSidebarProps {
  mobileFilterOpen: boolean;
  onCloseMobileFilter: () => void;
  filterSearch: string;
  onFilterSearchChange: (val: string) => void;
  selectedDept: string;
  onSelectedDeptChange: (val: string) => void;
  selectedArea: string;
  onSelectedAreaChange: (val: string) => void;
  ranks: ProfessorRanksState;
  onRankChange: (key: keyof ProfessorRanksState, val: boolean) => void;
  openings: ProfessorOpeningsState;
  onOpeningChange: (key: keyof ProfessorOpeningsState, val: boolean) => void;
  yearsAtMit: number;
  onYearsAtMitChange: (val: number) => void;
  hIndex: number;
  onHIndexChange: (val: number) => void;
  citationCount: number;
  onCitationCountChange: (val: number) => void;
  onlyActiveResearchers: boolean;
  onToggleActiveResearchers: () => void;
  onResetFilters: () => void;
}

export function ProfessorFiltersSidebar({
  mobileFilterOpen,
  onCloseMobileFilter,
  filterSearch,
  onFilterSearchChange,
  selectedDept,
  onSelectedDeptChange,
  selectedArea,
  onSelectedAreaChange,
  ranks,
  onRankChange,
  openings,
  onOpeningChange,
  yearsAtMit,
  onYearsAtMitChange,
  hIndex,
  onHIndexChange,
  citationCount,
  onCitationCountChange,
  onlyActiveResearchers,
  onToggleActiveResearchers,
  onResetFilters,
}: ProfessorFiltersSidebarProps) {
  return (
    <aside
      className={`${
        mobileFilterOpen ? "block" : "hidden"
      } lg:block w-full lg:w-[288px] shrink-0 space-y-4 pr-1 pb-4`}
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Filter Professors</h2>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-[#5D3FD3] hover:underline font-semibold cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* Search within results */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700">Search</label>
          <div className="relative">
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => onFilterSearchChange(e.target.value)}
              placeholder="Search within results..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]/20 focus:border-[#5D3FD3]"
            />
          </div>
        </div>

        {/* Department Selector */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => onSelectedDeptChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]/20 focus:border-[#5D3FD3]"
          >
            <option value="All Departments">All Departments</option>
            <option value="EECS">EECS (Computer Science)</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>

        {/* Research Area */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700">Research Area</label>
          <select
            value={selectedArea}
            onChange={(e) => onSelectedAreaChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]/20 focus:border-[#5D3FD3]"
          >
            <option value="All Research Areas">All Research Areas</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="Robotics">Robotics</option>
            <option value="Quantum Computing">Quantum Computing</option>
          </select>
        </div>

        {/* Academic Rank Checkboxes */}
        <div className="space-y-2 text-left pt-1 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">Academic Rank</label>
          <div className="space-y-2 text-xs text-slate-600">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ranks.professor}
                  onChange={(e) => onRankChange("professor", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Professor</span>
              </div>
              <span className="text-slate-400 text-[11px]">(312)</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ranks.assoc}
                  onChange={(e) => onRankChange("assoc", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Associate Professor</span>
              </div>
              <span className="text-slate-400 text-[11px]">(478)</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ranks.assistant}
                  onChange={(e) => onRankChange("assistant", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Assistant Professor</span>
              </div>
              <span className="text-slate-400 text-[11px]">(356)</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ranks.lecturer}
                  onChange={(e) => onRankChange("lecturer", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Lecturer</span>
              </div>
              <span className="text-slate-400 text-[11px]">(101)</span>
            </label>
          </div>
        </div>

        {/* Openings */}
        <div className="space-y-2 text-left pt-1 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">Openings</label>
          <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white mb-2 focus:outline-none">
            <option>All</option>
            <option>Has Available Positions</option>
          </select>

          <div className="space-y-2 text-xs text-slate-600">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={openings.phd}
                  onChange={(e) => onOpeningChange("phd", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>PhD</span>
              </div>
              <span className="text-slate-400 text-[11px]">(240)</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={openings.postdoc}
                  onChange={(e) => onOpeningChange("postdoc", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Postdoc</span>
              </div>
              <span className="text-slate-400 text-[11px]">(186)</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={openings.researchAssociate}
                  onChange={(e) => onOpeningChange("researchAssociate", e.target.checked)}
                  className="rounded border-slate-300 text-[#5D3FD3] focus:ring-[#5D3FD3]"
                />
                <span>Research Associate</span>
              </div>
              <span className="text-slate-400 text-[11px]">(112)</span>
            </label>
          </div>
        </div>

        {/* Years at MIT Slider */}
        <div className="space-y-1.5 text-left pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700">Years at MIT</label>
            <span className="text-slate-500">{yearsAtMit} yrs</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={yearsAtMit}
            onChange={(e) => onYearsAtMitChange(Number(e.target.value))}
            className="w-full accent-[#5D3FD3]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0</span>
            <span>40+</span>
          </div>
        </div>

        {/* h-index Slider */}
        <div className="space-y-1.5 text-left pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700">h-index</label>
            <span className="text-slate-500">{hIndex}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hIndex}
            onChange={(e) => onHIndexChange(Number(e.target.value))}
            className="w-full accent-[#5D3FD3]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0</span>
            <span>100+</span>
          </div>
        </div>

        {/* Citation Count Slider */}
        <div className="space-y-1.5 text-left pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700">Citation Count</label>
            <span className="text-slate-500">{citationCount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={citationCount}
            onChange={(e) => onCitationCountChange(Number(e.target.value))}
            className="w-full accent-[#5D3FD3]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0</span>
            <span>50,000+</span>
          </div>
        </div>

        {/* Show only active researchers switch */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Show only active researchers</span>
          <button
            type="button"
            onClick={onToggleActiveResearchers}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              onlyActiveResearchers ? "bg-[#5D3FD3]" : "bg-slate-200"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                onlyActiveResearchers ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Apply & Reset */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onCloseMobileFilter}
            className="w-full py-2.5 rounded-xl border border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors text-xs font-bold cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
