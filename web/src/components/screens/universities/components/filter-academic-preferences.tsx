import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UNIVERSITY_FILTER_OPTIONS } from "../university-data";

export interface FilterAcademicPreferencesProps {
  isOpen: boolean;
  onToggle: () => void;
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
}

export function FilterAcademicPreferences({
  isOpen,
  onToggle,
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
}: FilterAcademicPreferencesProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-left space-y-2.5 shadow-2xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
      >
        <span>Academic Preferences</span>
        <ChevronUp
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="space-y-2.5 pt-0.5 text-xs">
          {/* Degree Level */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-600">Degree Level</label>
            <div className="relative">
              <select
                value={degreeLevel}
                onChange={(e) => onDegreeLevelChange(e.target.value)}
                className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
              >
                {UNIVERSITY_FILTER_OPTIONS.degreeLevels.map((lvl) => (
                  <option key={lvl}>{lvl}</option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Field of Study */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-600">Field of Study</label>
            <div className="relative">
              <select
                value={fieldOfStudy}
                onChange={(e) => onFieldOfStudyChange(e.target.value)}
                className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
              >
                {UNIVERSITY_FILTER_OPTIONS.fieldsOfStudy.map((fld) => (
                  <option key={fld}>{fld}</option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Specialization (Optional) */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-600">
              Specialization <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <select
                value={specialization}
                onChange={(e) => onSpecializationChange(e.target.value)}
                className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
              >
                {UNIVERSITY_FILTER_OPTIONS.specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Sliders: GPA & IELTS */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* GPA Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 font-medium">GPA <span className="text-slate-400">(Min)</span></span>
                <span className="font-bold text-[#5D3FD3]">{gpaMin.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="4.0"
                step="0.1"
                value={gpaMin}
                onChange={(e) => onGpaMinChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D3FD3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>2.5</span>
                <span>4.0</span>
              </div>
            </div>

            {/* IELTS Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 font-medium">IELTS Score <span className="text-slate-400">(Min)</span></span>
                <span className="font-bold text-[#5D3FD3]">{ieltsMin.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.5"
                step="0.5"
                value={ieltsMin}
                onChange={(e) => onIeltsMinChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D3FD3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>6.0</span>
                <span>8.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
