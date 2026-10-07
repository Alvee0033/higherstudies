"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Heart,
  SlidersHorizontal,
  ChevronUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Bookmark,
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
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "stanford",
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
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "toronto",
    name: "University of Toronto",
    location: "Toronto, Ontario, Canada",
    badge: "Top 20 Worldwide",
    qsRank: 21,
    acceptanceRate: "43%",
    annualTuition: "$42,500",
    matchScore: 88,
    greRequired: false,
    ieltsScore: "6.5+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "oxford",
    name: "University of Oxford",
    location: "Oxford, Oxfordshire, United Kingdom",
    badge: "Top 5 Worldwide",
    qsRank: 4,
    acceptanceRate: "17%",
    annualTuition: "£32,000",
    matchScore: 90,
    greRequired: false,
    ieltsScore: "7.5+",
    fundingAvailable: true,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=120&q=80",
  },
];

export function UniversitiesExplorerView() {
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({ mit: true });
  const [gpaMin, setGpaMin] = React.useState(3.0);
  const [ieltsMin, setIeltsMin] = React.useState(7.0);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Find Universities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Discover universities that match your academic profile and preferences
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-[#4F46E5] text-xs font-bold border border-indigo-100">
            120 Results Found
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + University Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Filters Panel (Desktop Sticky / Mobile Collapsible) */}
        <aside
          className={`${
            mobileFilterOpen ? "block" : "hidden"
          } lg:block lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-6 sticky top-24 z-10`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 font-heading">Filters</h2>
            <button
              type="button"
              onClick={() => {
                setGpaMin(3.0);
                setIeltsMin(7.0);
              }}
              className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Academic Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Academic Preferences</span>
              <ChevronUp className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Degree Level
                </label>
                <select className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#4F46E5] focus:outline-none">
                  <option>Master&apos;s</option>
                  <option>PhD / Doctorate</option>
                  <option>Undergraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Field of Study
                </label>
                <select className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#4F46E5] focus:outline-none">
                  <option>Computer Science</option>
                  <option>Data Science & AI</option>
                  <option>Electrical Engineering</option>
                  <option>Biomedical Sciences</option>
                </select>
              </div>

              {/* GPA Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>GPA (Min)</span>
                  <span className="text-[#4F46E5]">{gpaMin.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="4.0"
                  step="0.1"
                  value={gpaMin}
                  onChange={(e) => setGpaMin(parseFloat(e.target.value))}
                  className="w-full accent-[#4F46E5] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>2.5</span>
                  <span>4.0</span>
                </div>
              </div>

              {/* IELTS Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>IELTS Score (Min)</span>
                  <span className="text-[#4F46E5]">{ieltsMin.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="8.5"
                  step="0.5"
                  value={ieltsMin}
                  onChange={(e) => setIeltsMin(parseFloat(e.target.value))}
                  className="w-full accent-[#4F46E5] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>6.0</span>
                  <span>8.5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Preferences */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Location Preferences</span>
              <ChevronUp className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">
                United States <Check className="h-3 w-3" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">
                Canada <Check className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 space-y-2">
            <button
              type="button"
              className="w-full h-11 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Apply Filters (12)
            </button>
            <button
              type="button"
              className="w-full h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Save Search</span>
            </button>
          </div>
        </aside>

        {/* Right Cards List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {UNIVERSITIES.map((uni, idx) => {
            const isFav = !!favorites[uni.id];

            return (
              <div
                key={uni.id}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Best Match Pill on first item */}
                {idx === 0 && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      Best Match
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uni.logo} alt={uni.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading group-hover:text-[#4F46E5] transition-colors leading-snug">
                          {uni.name}
                        </h2>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{uni.location}</span>
                        </div>
                        {uni.badge && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#4F46E5] text-[10px] font-bold">
                            {uni.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bookmark Heart */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(uni.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isFav
                          ? "text-rose-500 bg-rose-50"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      }`}
                      aria-label="Save university"
                    >
                      <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-left">
                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        QS Ranking
                      </p>
                      <p className="text-base font-extrabold text-slate-900 mt-0.5">{uni.qsRank}</p>
                    </div>
                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Acceptance Rate
                      </p>
                      <p className="text-base font-extrabold text-slate-900 mt-0.5">
                        {uni.acceptanceRate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Annual Tuition
                      </p>
                      <p className="text-base font-extrabold text-slate-900 mt-0.5">
                        {uni.annualTuition}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Match Score
                      </p>
                      <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                        {uni.matchScore}%
                      </p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {uni.greRequired && (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold">
                          GRE Required
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold">
                        IELTS {uni.ieltsScore}
                      </span>
                      {uni.fundingAvailable && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold">
                          Funding Available
                        </span>
                      )}
                    </div>

                    <Link
                      href="/professors"
                      className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all text-center shrink-0 cursor-pointer"
                    >
                      View Professors
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="h-8 w-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center">
                1
              </span>
              <span className="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer">
                2
              </span>
              <span className="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer">
                3
              </span>
              <span className="px-1 text-slate-400">...</span>
              <span className="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer">
                12
              </span>
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
