"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  X,
  AlertCircle,
  FileText,
  SlidersHorizontal,
} from "lucide-react";

interface UniversityItem {
  id: string;
  name: string;
  location: string;
  badge?: string;
  qsRank: number;
  acceptanceRate: string;
  annualTuition: string;
  matchScore: number;
  greRequired: boolean;
  ieltsScore: string;
  fundingAvailable: boolean;
  logo: string;
}

const UNIVERSITIES: UniversityItem[] = [
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts, United States",
    badge: "Top 1 Worldwide",
    qsRank: 1,
    acceptanceRate: "4%",
    annualTuition: "$55,878",
    matchScore: 95,
    greRequired: true,
    ieltsScore: "7.0+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "stanford-1",
    name: "Stanford University",
    location: "Stanford, California, United States",
    badge: "Top 3 Worldwide",
    qsRank: 3,
    acceptanceRate: "4.2%",
    annualTuition: "$58,169",
    matchScore: 92,
    greRequired: true,
    ieltsScore: "7.0+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "stanford-2",
    name: "Stanford University",
    location: "Stanford, California, United States",
    badge: "Top 3 Worldwide",
    qsRank: 3,
    acceptanceRate: "4.2%",
    annualTuition: "$58,169",
    matchScore: 92,
    greRequired: true,
    ieltsScore: "7.0+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "stanford-3",
    name: "Stanford University",
    location: "Stanford, California, United States",
    badge: "Top 3 Worldwide",
    qsRank: 3,
    acceptanceRate: "4.2%",
    annualTuition: "$58,169",
    matchScore: 92,
    greRequired: true,
    ieltsScore: "7.0+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=160&q=80",
  },
];

export function UniversitiesExplorerView() {
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [sidebarHidden, setSidebarHidden] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({ mit: true });

  // Accordion state
  const [academicOpen, setAcademicOpen] = React.useState(true);
  const [locationOpen, setLocationOpen] = React.useState(true);
  const [financialOpen, setFinancialOpen] = React.useState(false);
  const [universityPrefOpen, setUniversityPrefOpen] = React.useState(false);
  const [programPrefOpen, setProgramPrefOpen] = React.useState(false);

  // Form values
  const [degreeLevel, setDegreeLevel] = React.useState("Master's");
  const [fieldOfStudy, setFieldOfStudy] = React.useState("Computer Science");
  const [specialization, setSpecialization] = React.useState("");
  const [gpaMin, setGpaMin] = React.useState(3.0);
  const [ieltsMin, setIeltsMin] = React.useState(7.0);
  const [studyDestination, setStudyDestination] = React.useState("Any Country");
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([
    "United States",
    "Canada",
  ]);
  const [excludeCountry, setExcludeCountry] = React.useState("");
  const [sortBy, setSortBy] = React.useState("Best Match");
  const [currentPage, setCurrentPage] = React.useState(1);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeCountry = (c: string) => {
    setSelectedCountries((prev) => prev.filter((item) => item !== c));
  };

  const clearAllFilters = () => {
    setDegreeLevel("Master's");
    setFieldOfStudy("Computer Science");
    setSpecialization("");
    setGpaMin(3.0);
    setIeltsMin(7.0);
    setStudyDestination("Any Country");
    setSelectedCountries(["United States", "Canada"]);
    setExcludeCountry("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Top Controls Bar */}
      <div className="lg:hidden flex items-center justify-between pb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">Find Universities</h1>
          <p className="text-xs text-slate-500">120 Results Found</p>
        </div>
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#5D3FD3]" />
          <span>Filters (12)</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Left Filters Sidebar */}
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
              onClick={() => setSidebarHidden(!sidebarHidden)}
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
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-left space-y-2.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setAcademicOpen(!academicOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <span>Academic Preferences</span>
                  <ChevronUp
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      academicOpen ? "" : "rotate-180"
                    }`}
                  />
                </button>

                {academicOpen && (
                  <div className="space-y-2.5 pt-0.5 text-xs">
                    {/* Degree Level */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-600">Degree Level</label>
                      <div className="relative">
                        <select
                          value={degreeLevel}
                          onChange={(e) => setDegreeLevel(e.target.value)}
                          className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
                        >
                          <option>Master&apos;s</option>
                          <option>PhD / Doctorate</option>
                          <option>Undergraduate</option>
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
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
                        >
                          <option>Computer Science</option>
                          <option>Data Science & AI</option>
                          <option>Electrical Engineering</option>
                          <option>Biomedical Sciences</option>
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
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
                        >
                          <option value="">Select specialization</option>
                          <option value="ml">Machine Learning</option>
                          <option value="systems">Computer Systems</option>
                          <option value="security">Cybersecurity</option>
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Sliders in a tight 2-column on compact view */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      {/* GPA Slider */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600">GPA (Min)</span>
                          <span className="text-[#5D3FD3] font-bold">{gpaMin.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="2.5"
                          max="4.0"
                          step="0.1"
                          value={gpaMin}
                          onChange={(e) => setGpaMin(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D3FD3]"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>2.5</span>
                          <span>4.0</span>
                        </div>
                      </div>

                      {/* IELTS Slider */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600">IELTS Score (Min)</span>
                          <span className="text-[#5D3FD3] font-bold">{ieltsMin.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="6.0"
                          max="8.5"
                          step="0.5"
                          value={ieltsMin}
                          onChange={(e) => setIeltsMin(parseFloat(e.target.value))}
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
              {/* 2. Location Preferences Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-4">
                <button
                  type="button"
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>Location Preferences</span>
                  <ChevronUp
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      locationOpen ? "" : "rotate-180"
                    }`}
                  />
                </button>

                {locationOpen && (
                  <div className="space-y-3.5 pt-1 text-xs">
                    {/* Study Destination */}
                    <div className="space-y-1">
                      <label className="block text-xs font-normal text-slate-700">Study Destination</label>
                      <div className="relative">
                        <select
                          value={studyDestination}
                          onChange={(e) => setStudyDestination(e.target.value)}
                          className="w-full h-9.5 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
                        >
                          <option>Any Country</option>
                          <option>North America</option>
                          <option>Europe</option>
                          <option>Asia Pacific</option>
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
                              onClick={() => removeCountry(country)}
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
                          onChange={(e) => setExcludeCountry(e.target.value)}
                          className="w-full h-9.5 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#5D3FD3] appearance-none"
                        >
                          <option value="">Select countries</option>
                          <option value="none">None</option>
                        </select>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Financial Preferences Box (Accordion) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
                <button
                  type="button"
                  onClick={() => setFinancialOpen(!financialOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>Financial Preferences</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      financialOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {financialOpen && (
                  <div className="pt-3 text-xs text-slate-500 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>Full Tuition Waiver</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>Assistantship (RA/TA) Available</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 4. University Preferences Box (Accordion) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
                <button
                  type="button"
                  onClick={() => setUniversityPrefOpen(!universityPrefOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>University Preferences</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      universityPrefOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {universityPrefOpen && (
                  <div className="pt-3 text-xs text-slate-500 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>Top 100 QS Ranked</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>High Research Output (R1)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 5. Program Preferences Box (Accordion) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
                <button
                  type="button"
                  onClick={() => setProgramPrefOpen(!programPrefOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>Program Preferences</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      programPrefOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {programPrefOpen && (
                  <div className="pt-3 text-xs text-slate-500 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>Fall 2025 Intake</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-[#5D3FD3] accent-[#5D3FD3]" />
                      <span>Spring 2026 Intake</span>
                    </label>
                  </div>
                )}
              </div>

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

        {/* Right University Cards Area - expands responsively to eliminate right dead space */}
        <section className="flex-1 w-full space-y-4 min-w-0">
          {/* Top Results Header: Clear All, 120 Results Found, Sort by */}
          <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-normal text-[#5D3FD3] hover:underline cursor-pointer"
              >
                Clear All
              </button>
              <div className="hidden lg:flex h-8 px-3.5 rounded-lg bg-[#E8E4FF] border border-[#C7D2FE] items-center text-xs font-medium text-[#5D3FD3]">
                120 Results Found
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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

          {/* Cards List */}
          <div className="space-y-4">
            {UNIVERSITIES.map((uni, idx) => {
              const isFav = !!favorites[uni.id];
              const isFirst = idx === 0;

              return (
                <div
                  key={uni.id}
                  className={`bg-white rounded-2xl p-6 border shadow-2xs relative text-left transition-all ${
                    isFirst ? "border-[#5D3FD3] ring-1 ring-[#5D3FD3]/30" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Best Match Pill on MIT card */}
                  {isFirst && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold shadow-2xs">
                        Best Match
                      </span>
                    </div>
                  )}

                  {/* Bookmark Heart Top-Right */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(uni.id)}
                    className="absolute top-6 right-6 p-1 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
                    aria-label="Save university"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFav ? "fill-[#EF4444] text-[#EF4444]" : "text-slate-300"
                      }`}
                    />
                  </button>

                  {/* University Profile Info */}
                  <div className="flex items-start gap-4">
                    {/* Logo container (96x96 with 12px corner radius in Figma) */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border border-slate-100 bg-white p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uni.logo}
                        alt={uni.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                      <h3 className="text-base sm:text-xl font-bold text-slate-900 font-heading leading-snug">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{uni.location}</span>
                      </div>

                      {uni.badge && (
                        <div className="mt-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#5D3FD3] text-[11px] sm:text-xs font-medium">
                            {uni.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 Metrics Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 pt-4 pb-4 border-b border-slate-100 text-left">
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-normal">QS Ranking</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.qsRank}</p>
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Acceptance Rate</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.acceptanceRate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Annual Tuition</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{uni.annualTuition}</p>
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-normal">Match Score</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm sm:text-base font-bold text-slate-900">{uni.matchScore}%</span>
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-emerald-500 border-t-transparent -rotate-45 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: 3 Badges + View Professors Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-3">
                    {/* 3 Requirement Badges */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {uni.greRequired && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[11px] sm:text-xs font-semibold text-[#DC2626]">
                          <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                          <span>GRE Required</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[11px] sm:text-xs font-semibold text-[#2563EB]">
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        <span>IELTS {uni.ieltsScore}</span>
                      </div>

                      {uni.fundingAvailable && (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] sm:text-xs font-semibold text-[#16A34A]">
                          <span>Funding Available</span>
                        </div>
                      )}
                    </div>

                    {/* View Professors Button */}
                    <Link
                      href="/professors"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold flex items-center justify-center text-center shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      View Professors
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls matching Figma */}
          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 text-xs">
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium cursor-pointer transition-colors ${
                    pageNum > 2 ? "hidden sm:flex" : "flex"
                  } ${
                    currentPage === pageNum
                      ? "bg-[#5D3FD3] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <span className="hidden sm:inline px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(12)}
                className={`hidden sm:flex w-8 h-8 rounded-lg items-center justify-center font-medium cursor-pointer ${
                  currentPage === 12
                    ? "bg-[#5D3FD3] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                12
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
