"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Bookmark,
  CheckCircle2,
  GraduationCap,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Building2,
  Users,
  Compass,
  Award,
  Activity,
} from "lucide-react";

interface Professor {
  id: string;
  name: string;
  verified?: boolean;
  title: string;
  department: string;
  topics: string[];
  phd: string;
  hIndex: number;
  citations: string;
  publications: number;
  yearsAtMit: number;
  currentStudents: number;
  openings: string;
  avatar: string;
}

const PROFESSORS_DATA: Professor[] = [
  {
    id: "jonathan-smith",
    name: "Prof. Jonathan Smith",
    verified: true,
    title: "Professor of Computer Science and Engineering",
    department: "Department of Electrical Engineering & Computer Science",
    topics: ["Machine Learning", "Deep Learning", "Computer Vision"],
    phd: "PhD, Stanford University",
    hIndex: 45,
    citations: "12,567",
    publications: 156,
    yearsAtMit: 8,
    currentStudents: 12,
    openings: "2 PhD, 1 Postdoc",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "maria-chen",
    name: "Prof. Maria Chen",
    verified: true,
    title: "Associate Professor of Electrical Engineering",
    department: "Department of Electrical Engineering & Computer Science",
    topics: ["AI Ethics", "Robotics", "Human-AI Interaction"],
    phd: "PhD, UC Berkeley",
    hIndex: 32,
    citations: "8,923",
    publications: 89,
    yearsAtMit: 5,
    currentStudents: 8,
    openings: "1 PhD",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "arjun-patel",
    name: "Prof. Arjun Patel",
    verified: true,
    title: "Professor of Data Science",
    department: "Institute for Data, Systems, and Society (IDSS)",
    topics: ["Data Mining", "Statistical Learning", "Big Data"],
    phd: "PhD, MIT",
    hIndex: 28,
    citations: "6,789",
    publications: 112,
    yearsAtMit: 12,
    currentStudents: 15,
    openings: "2 PhD, 1 RA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  },
];

export function ProfessorListView() {
  const [activeTab, setActiveTab] = React.useState<"all" | "department" | "research" | "recent">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterSearch, setFilterSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All Departments");
  const [selectedArea, setSelectedArea] = React.useState("All Research Areas");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = React.useState("Relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [isSavedUniversity, setIsSavedUniversity] = React.useState(false);
  const [savedProfessors, setSavedProfessors] = React.useState<Record<string, boolean>>({});

  // Rank filters
  const [ranks, setRanks] = React.useState<Record<string, boolean>>({
    professor: false,
    assoc: false,
    assistant: false,
    lecturer: false,
  });

  // Openings filters
  const [openings, setOpenings] = React.useState<Record<string, boolean>>({
    phd: false,
    postdoc: false,
    researchAssociate: false,
  });

  // Sliders
  const [yearsAtMit, setYearsAtMit] = React.useState(40);
  const [hIndex, setHIndex] = React.useState(100);
  const [citationCount, setCitationCount] = React.useState(50000);
  const [onlyActiveResearchers, setOnlyActiveResearchers] = React.useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  const toggleSaveProfessor = (id: string) => {
    setSavedProfessors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setFilterSearch("");
    setSelectedDept("All Departments");
    setSelectedArea("All Research Areas");
    setRanks({ professor: false, assoc: false, assistant: false, lecturer: false });
    setOpenings({ phd: false, postdoc: false, researchAssociate: false });
    setYearsAtMit(40);
    setHIndex(100);
    setCitationCount(50000);
    setOnlyActiveResearchers(true);
  };

  return (
    <div className="w-full">
      {/* 2-Column Section: Left Main Content (664px) + Right Sidebar (288px) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Main Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* 1. Breadcrumb matching Figma */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/universities" className="hover:text-slate-800 transition-colors">
              Universities
            </Link>
            <span>&gt;</span>
            <span className="text-slate-600">Massachusetts Institute of Technology</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Professors</span>
          </nav>

          {/* 2. MIT Header Card matching Figma */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* MIT Logo block */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#5D3FD3]/30 bg-slate-50 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-2xl sm:text-3xl font-black text-[#A31F34] tracking-tighter">MIT</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                      Professors at MIT
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
                      Top 1 Worldwide
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Massachusetts Institute of Technology
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSavedUniversity(!isSavedUniversity)}
                  className={`h-9 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSavedUniversity
                      ? "bg-[#EEF2FF] border-[#6366F1] text-[#4F46E5]"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSavedUniversity ? "fill-current" : ""}`} />
                  <span>{isSavedUniversity ? "Saved University" : "Save University"}</span>
                </button>
                <Link
                  href="/universities"
                  className="h-9 px-4 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>University Details</span>
                </Link>
              </div>
            </div>

            {/* 5 Stats Cards matching exact Figma screen 05 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Total Professors</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">1,247</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Departments</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">33</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center shrink-0">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Research Areas</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">120+</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Active Researchers</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">892</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Avg h-index</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mt-0.5">45</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Navigation Tabs Bar */}
          <div className="border-b border-slate-200 flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-6 sm:gap-8 min-w-max">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "border-[#5D3FD3] text-[#5D3FD3]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                All Professors (1,247)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("department")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "department"
                    ? "border-[#5D3FD3] text-[#5D3FD3]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                By Department
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("research")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "research"
                    ? "border-[#5D3FD3] text-[#5D3FD3]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                By Research Area
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("recent")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
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
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search professors..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]/20 focus:border-[#5D3FD3]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    viewMode === "grid" ? "bg-white shadow-2xs text-[#5D3FD3]" : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
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

          {/* 5. Professor Cards List */}
          <div className="space-y-4">
            {PROFESSORS_DATA.map((prof) => {
              const isSaved = !!savedProfessors[prof.id];
              return (
                <div
                  key={prof.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all text-left flex flex-col md:flex-row gap-5 items-start justify-between"
                >
                  {/* Left profile info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={prof.avatar}
                        alt={prof.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/professors/${prof.id}`}
                          className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#5D3FD3] transition-colors"
                        >
                          {prof.name}
                        </Link>
                        {prof.verified && (
                          <CheckCircle2 className="h-4 w-4 text-[#5D3FD3] fill-[#5D3FD3]/10 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {prof.title}
                      </p>

                      {/* Topic Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {prof.topics.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          +2
                        </span>
                      </div>

                      {/* PhD text */}
                      <div className="flex items-center gap-1.5 pt-2 text-xs text-slate-500">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span>{prof.phd}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right metrics + actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleSaveProfessor(prof.id)}
                      className={`text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer hidden md:block ${
                        isSaved ? "text-[#5D3FD3] hover:text-[#5D3FD3]" : ""
                      }`}
                      aria-label="Bookmark professor"
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-[#5D3FD3] text-[#5D3FD3]" : ""}`} />
                    </button>

                    {/* 2x3 Metrics Grid matching Figma */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left md:text-right">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">H-INDEX</p>
                        <p className="text-sm font-bold text-slate-900">{prof.hIndex}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">CITATIONS</p>
                        <p className="text-sm font-bold text-slate-900">{prof.citations}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">PUBLICATIONS</p>
                        <p className="text-sm font-bold text-slate-900">{prof.publications}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">YEARS AT MIT</p>
                        <p className="text-sm font-bold text-slate-900">{prof.yearsAtMit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">CURRENT STUDENTS</p>
                        <p className="text-sm font-bold text-slate-900">{prof.currentStudents}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">OPENINGS</p>
                        <p className="text-sm font-bold text-emerald-600">{prof.openings}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSaveProfessor(prof.id)}
                        className={`md:hidden p-2 rounded-xl border border-slate-200 text-slate-500 cursor-pointer ${
                          isSaved ? "text-[#5D3FD3] border-[#5D3FD3]" : ""
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-[#5D3FD3]" : ""}`} />
                      </button>
                      <Link
                        href={`/professors/${prof.id}`}
                        className="px-5 py-2 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 6. Bottom Pagination matching Figma */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-500">
              Showing 1 to 10 of 1,247 professors
            </p>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
                  currentPage === 1 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
                  currentPage === 2 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(3)}
                className={`hidden sm:flex w-8 h-8 rounded-lg font-semibold items-center justify-center cursor-pointer ${
                  currentPage === 3 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                3
              </button>
              <span className="hidden sm:inline px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(125)}
                className={`hidden sm:flex w-8 h-8 rounded-lg font-semibold items-center justify-center cursor-pointer ${
                  currentPage === 125 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                125
              </button>
              <button
                type="button"
                disabled={currentPage === 125}
                onClick={() => setCurrentPage((p) => Math.min(125, p + 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Filter Professors Panel (w-[288px] exact Figma width) */}
        <aside
          className={`${
            mobileFilterOpen ? "block" : "hidden"
          } lg:block w-full lg:w-[288px] shrink-0 space-y-4 pr-1 pb-4`}
        >
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Filter Professors</h2>
              <button
                onClick={handleResetFilters}
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
                  onChange={(e) => setFilterSearch(e.target.value)}
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
                onChange={(e) => setSelectedDept(e.target.value)}
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
                onChange={(e) => setSelectedArea(e.target.value)}
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
                      onChange={(e) => setRanks({ ...ranks, professor: e.target.checked })}
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
                      onChange={(e) => setRanks({ ...ranks, assoc: e.target.checked })}
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
                      onChange={(e) => setRanks({ ...ranks, assistant: e.target.checked })}
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
                      onChange={(e) => setRanks({ ...ranks, lecturer: e.target.checked })}
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
                      onChange={(e) => setOpenings({ ...openings, phd: e.target.checked })}
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
                      onChange={(e) => setOpenings({ ...openings, postdoc: e.target.checked })}
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
                      onChange={(e) => setOpenings({ ...openings, researchAssociate: e.target.checked })}
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
                onChange={(e) => setYearsAtMit(Number(e.target.value))}
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
                onChange={(e) => setHIndex(Number(e.target.value))}
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
                onChange={(e) => setCitationCount(Number(e.target.value))}
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
                onClick={() => setOnlyActiveResearchers(!onlyActiveResearchers)}
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
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl border border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors text-xs font-bold cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
