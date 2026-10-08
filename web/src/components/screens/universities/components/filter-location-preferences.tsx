import * as React from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { UNIVERSITY_FILTER_OPTIONS } from "../university-data";

export interface FilterLocationPreferencesProps {
  isOpen: boolean;
  onToggle: () => void;
  studyDestination: string;
  onStudyDestinationChange: (val: string) => void;
  selectedCountries: string[];
  onRemoveCountry: (country: string) => void;
  excludeCountry: string;
  onExcludeCountryChange: (val: string) => void;
}

export function FilterLocationPreferences({
  isOpen,
  onToggle,
  studyDestination,
  onStudyDestinationChange,
  selectedCountries,
  onRemoveCountry,
  excludeCountry,
  onExcludeCountryChange,
}: FilterLocationPreferencesProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
      >
        <span>Location Preferences</span>
        <ChevronUp
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="space-y-3.5 pt-1 text-xs">
          {/* Study Destination */}
          <div className="space-y-1">
            <label className="block text-xs font-normal text-slate-700">Study Destination</label>
            <div className="relative">
              <select
                value={studyDestination}
                onChange={(e) => onStudyDestinationChange(e.target.value)}
                className="w-full h-9.5 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
              >
                {UNIVERSITY_FILTER_OPTIONS.studyDestinations.map((dest) => (
                  <option key={dest}>{dest}</option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Preferred Countries with chips */}
          <div className="space-y-1">
            <label className="block text-xs font-normal text-slate-700">Preferred Countries</label>
            <div className="min-h-9.5 p-1.5 rounded-lg border border-slate-200 bg-white flex flex-wrap items-center gap-1.5">
              {selectedCountries.map((country) => (
                <span
                  key={country}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#5D3FD3] text-[11px] font-medium"
                >
                  <span>{country}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveCountry(country)}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Exclude Countries (Optional) */}
          <div className="space-y-1">
            <label className="block text-xs font-normal text-slate-700">
              Exclude Countries <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <select
                value={excludeCountry}
                onChange={(e) => onExcludeCountryChange(e.target.value)}
                className="w-full h-9.5 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
              >
                {UNIVERSITY_FILTER_OPTIONS.excludeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
