"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  Users,
  Search,
  ExternalLink,
  Trash2,
  Mail,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";

import rawSavedItems from "@/data/json/saved-items/saved-items.json";

interface SavedUniversity {
  id: string;
  name: string;
  location: string;
  ranking: string;
  acceptanceRate: string;
  minGpa: string;
  deadline: string;
  logo: string;
}

interface SavedProfessor {
  id: string;
  name: string;
  university: string;
  department: string;
  hIndex: number;
  citations: number;
  funding: boolean;
  research: string[];
  avatar: string;
}

const SAVED_UNIS: SavedUniversity[] = rawSavedItems.savedUniversities;
const SAVED_PROFS: SavedProfessor[] = rawSavedItems.savedProfessors;

export function SavedItemsView() {
  const [activeTab, setActiveTab] = React.useState<"all" | "unis" | "profs">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [unis, setUnis] = React.useState(SAVED_UNIS);
  const [profs, setProfs] = React.useState(SAVED_PROFS);

  const filteredUnis = unis.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfs = profs.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.research.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const removeUni = (id: string) => {
    setUnis(unis.filter((u) => u.id !== id));
  };

  const removeProf = (id: string) => {
    setProfs(profs.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-[#4F46E5]">
              <Bookmark className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Saved Items
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your shortlisted universities and bookmarked faculty members.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved items..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#4F46E5] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          All Items ({unis.length + profs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unis")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "unis"
              ? "bg-[#4F46E5] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Universities ({unis.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profs")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "profs"
              ? "bg-[#4F46E5] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Professors ({profs.length})</span>
        </button>
      </div>

      {/* Universities Section */}
      {(activeTab === "all" || activeTab === "unis") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Building2 className="h-5 w-5 text-[#4F46E5]" />
              <span>Shortlisted Universities ({filteredUnis.length})</span>
            </h2>
            <Link
              href="/universities"
              className="text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Explore More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUnis.map((uni) => (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] text-[10px] font-bold">
                          {uni.ranking}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {uni.name}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeUni(uni.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Location</span>
                      <span className="text-slate-700 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="truncate">{uni.location}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Deadline</span>
                      <span className="text-slate-700 font-medium block mt-0.5">
                        {uni.deadline}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Min GPA</span>
                      <span className="text-slate-700 font-medium block mt-0.5">
                        {uni.minGpa}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Acceptance</span>
                      <span className="text-slate-700 font-medium block mt-0.5">
                        {uni.acceptanceRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/applications`}
                    className="flex-1 h-9 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Start Application</span>
                  </Link>
                  <Link
                    href={`/universities`}
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professors Section */}
      {(activeTab === "all" || activeTab === "profs") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Users className="h-5 w-5 text-[#4F46E5]" />
              <span>Bookmarked Professors ({filteredProfs.length})</span>
            </h2>
            <Link
              href="/professors"
              className="text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Discover Faculty →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfs.map((prof) => (
              <div
                key={prof.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {prof.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {prof.university} • {prof.department}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProf(prof.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {prof.research.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {prof.funding && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Open RA Funding
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span>h-index: </span>
                      <strong className="text-slate-900">{prof.hIndex}</strong>
                    </div>
                    <div>
                      <span>Citations: </span>
                      <strong className="text-slate-900">{prof.citations.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/ai-tools`}
                    className="flex-1 h-9 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>AI Cold Email</span>
                  </Link>
                  <Link
                    href={`/professors/${prof.id}`}
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
