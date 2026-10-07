"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  Building2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FileText,
  DollarSign,
  BookOpen,
} from "lucide-react";

export function ProfessorProfileView() {
  const [isSaved, setIsSaved] = React.useState(false);
  const [isTracking, setIsTracking] = React.useState(false);
  const [expandedBio, setExpandedBio] = React.useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Action matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/universities" className="hover:text-slate-800 transition-colors">
            Universities
          </Link>
          <span>&gt;</span>
          <Link href="/professors" className="hover:text-slate-800 transition-colors">
            Massachusetts Institute of Technology
          </Link>
          <span>&gt;</span>
          <Link href="/professors" className="hover:text-slate-800 transition-colors">
            Professors
          </Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold">Prof. Jonathan Smith</span>
        </nav>

        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
            isTracking
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#5D3FD3] text-white hover:bg-[#4E34B5]"
          }`}
        >
          <Bookmark className="h-4 w-4 fill-current" />
          <span>{isTracking ? "Added to Tracking" : "Add to Tracking"}</span>
        </button>
      </div>

      {/* Hero Professor Card matching Figma Screen 06 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-xs">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80"
                alt="Prof. Jonathan Smith"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="space-y-2 flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                  Prof. Jonathan Smith
                </h1>
                <CheckCircle2 className="h-5 w-5 text-[#5D3FD3] fill-[#5D3FD3]/10 shrink-0" />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                Professor of Computer Science and Engineering
              </p>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Massachusetts Institute of Technology (MIT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Department of Electrical Engineering & Computer Science</span>
                </div>
              </div>

              {/* Research tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {["Machine Learning", "Deep Learning", "Computer Vision", "Human-AI Interaction"].map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-slate-700"
                  >
                    {topic}
                  </span>
                ))}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                  +2
                </span>
              </div>

              {/* Acceptance badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Accepting PhD Students
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics Grid matching 2x3 block in Figma */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 text-left lg:text-right shrink-0">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">h-index</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">45</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Citations</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">12,567</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Publications</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">156</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Years at MIT</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">8</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Avg. Response Time</p>
              <p className="text-sm sm:text-base font-bold text-slate-800">2-3 days</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Current Students</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split: Left Details + Right Contact/Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start w-full">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <h2 className="text-lg font-bold text-slate-900 font-heading">About</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prof. Jonathan Smith is a Professor of Computer Science and Engineering at MIT. His research lies at the intersection of Machine Learning, Computer Vision, and Human-AI Interaction. He has published extensively in top-tier venues including CVPR, ICCV, NeurIPS, and ICML.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Academic Background
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-[#5D3FD3] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Ph.D. in Computer Science</p>
                      <p className="text-slate-500">Stanford University, 2012</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-[#5D3FD3] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">M.S. in Computer Science</p>
                      <p className="text-slate-500">UC Berkeley, 2008</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-[#5D3FD3] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">B.S. in Computer Science</p>
                      <p className="text-slate-500">UC Berkeley, 2006</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Research Interests
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• Machine Learning</li>
                  <li>• Deep Learning</li>
                  <li>• Computer Vision</li>
                  <li>• Human-AI Interaction</li>
                  <li>• Representation Learning</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setExpandedBio(!expandedBio)}
              className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer"
            >
              {expandedBio ? "Read less" : "Read more"}
            </button>
          </div>

          {/* Academic Rank & Experience Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Academic Rank & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#5D3FD3] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400">2016 - Present</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Professor, MIT</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#5D3FD3] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400">2010 - 2013</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Associate Professor, MIT</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#5D3FD3] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400">2010 - 2013</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Assistant Professor, MIT</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#5D3FD3] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400">2012 - 2013</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Postdoctoral Researcher, Stanford</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Areas tags */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-left">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Research Areas</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                "Machine Learning",
                "Deep Learning",
                "Computer Vision",
                "Human-AI Interaction",
                "Robotics",
                "Representation Learning",
              ].map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-slate-700"
                >
                  {area}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                +2
              </span>
            </div>
          </div>

          {/* Recent Publications */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-heading">Recent Publications</h2>
              <button className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer">
                View all (156)
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-50">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Learning to See in the Dark: Low-light Imaging with Deep Networks
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">CVPR 2024</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">2,345</p>
                  <p className="text-[10px] text-slate-400">Citations</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-50">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Vision Transformers for Dense Prediction Tasks
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">ICCV 2023</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">1,876</p>
                  <p className="text-[10px] text-slate-400">Citations</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 py-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Interactive Perception: Bridging Human and Machine Intuition
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">NeurIPS 2023</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">1,421</p>
                  <p className="text-[10px] text-slate-400">Citations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Research Projects */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-heading">Current Research Projects</h2>
              <button className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer">
                View all (12) &gt;
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="font-semibold text-slate-800">Self-Supervised Learning for 3D Perception</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">2023 - 2026</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">NSF</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="font-semibold text-slate-800">Human-AI Collaborative Perception</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">2023 - 2026</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">ONR</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="font-semibold text-slate-800">Efficient Vision Transformers</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">2023 - 2026</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700">Google</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold text-slate-800">Robust AI for Real-World Deployment</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">2023 - 2026</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700">MIT Seed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Funding */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-heading">Research Funding</h2>
              <button className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer">
                View all (8)
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <p className="font-bold text-slate-900">NSF CAREER Award</p>
                  <p className="text-xs text-slate-400">2020 - 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$500,000</p>
                  <p className="text-[10px] text-slate-400">PI</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <p className="font-bold text-slate-900">ONR Young Investigator Program</p>
                  <p className="text-xs text-slate-400">2022 - 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$600,000</p>
                  <p className="text-[10px] text-slate-400">PI</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <p className="font-bold text-slate-900">Google Research Award</p>
                  <p className="text-xs text-slate-400">2021 - 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$500,000</p>
                  <p className="text-[10px] text-slate-400">PI</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-slate-900">MIT Seed Fund</p>
                  <p className="text-xs text-slate-400">2024 - 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$150,000</p>
                  <p className="text-[10px] text-slate-400">PI</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5D3FD3] font-semibold pt-1 cursor-pointer hover:underline">
              +4 more grants
            </p>
          </div>

          {/* Teaching */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-heading">Teaching</h2>
              <button className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer">
                View all courses &gt;
              </button>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li>• 6.036 Introduction to Machine Learning (Fall 2024)</li>
              <li>• 6.869 Computer Vision (Spring 2024)</li>
              <li>• 6.867 Human-AI Interaction (Fall 2023)</li>
              <li>• Supervised Graduate Research (Ongoing)</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contact, External Links, Open Positions */}
        <aside className="space-y-6">
          {/* Contact Professor Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">Contact Professor</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="mailto:smith@mit.edu" className="text-[#5D3FD3] hover:underline">
                  smith@mit.edu
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>+1 (617) 253-XXXX</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>32-G524, Stata Center, MIT</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="https://web.mit.edu/smith" target="_blank" rel="noreferrer" className="text-[#5D3FD3] hover:underline truncate">
                  https://web.mit.edu/smith/
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <p>Last email sent: May 10, 2024</p>
              <p className="text-emerald-600 font-medium">Replied on May 12, 2024</p>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
              <Send className="h-4 w-4" />
              <span>Send Email</span>
            </button>
          </div>

          {/* At a Glance Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">At a Glance</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">ORCID</p>
                <p className="font-semibold text-slate-800">0000-0002-1825-0097</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Google Scholar</p>
                <a href="#" className="text-[#5D3FD3] hover:underline font-semibold">View Profile</a>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">ResearchGate</p>
                <a href="#" className="text-[#5D3FD3] hover:underline font-semibold">View Profile</a>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">LinkedIn</p>
                <a href="#" className="text-[#5D3FD3] hover:underline font-semibold">View Profile</a>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Twitter / X</p>
                <p className="font-semibold text-slate-800">@jonathansmith</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Lab Website</p>
                <a href="#" className="text-[#5D3FD3] hover:underline font-semibold truncate block">
                  https://smithlab.mit.edu/
                </a>
              </div>
            </div>
          </div>

          {/* Open Positions Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">Open Positions</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">2 PhD Positions</p>
                  <p className="text-slate-400 text-[11px]">Fall 2025</p>
                </div>
                <Briefcase className="h-4 w-4 text-slate-400" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">1 Postdoctoral Position</p>
                  <p className="text-slate-400 text-[11px]">Available Now</p>
                </div>
                <Briefcase className="h-4 w-4 text-slate-400" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">1 Research Assistant (RA)</p>
                  <p className="text-slate-400 text-[11px]">Summer 2025</p>
                </div>
                <Briefcase className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button className="w-full py-2 rounded-xl border border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors text-xs font-bold cursor-pointer">
              View Details
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Nav Buttons */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-200">
        <Link
          href="/professors"
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Professors</span>
        </Link>
        <button
          onClick={() => setIsTracking(!isTracking)}
          className="px-5 py-2.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Bookmark className="h-4 w-4 fill-current" />
          <span>{isTracking ? "Added to Tracking" : "Add to Tracking"}</span>
        </button>
      </div>
    </div>
  );
}
