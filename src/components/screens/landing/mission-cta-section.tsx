import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Globe,
  Star,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MISSION_SECTION } from "@/data/landing-content";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function MissionAndCTASection() {
  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-visible">

      {/* Unique Notebook/Blueprint Sketch Background with Seamless Feathered Gradient Mask */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Architectural Sketch Grid Pattern with 100% Seamless Top & Bottom Feathering */}
        <div
          className="absolute inset-0 opacity-[0.38]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        />

        {/* Ambient Watercolor / Light Glow Aura with Natural Edge Dissolves */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[520px] bg-gradient-to-r from-indigo-200/25 via-purple-150/20 to-amber-100/30 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-6 left-1/4 w-[600px] h-[380px] bg-indigo-200/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-purple-200/15 blur-[120px] rounded-full pointer-events-none" />

        {/* ================= PENCIL DOODLES COLLECTION ================= */}

        {/* Pencil Doodle 1: Sketched Open Book & Knowledge Rays (Top-Left) */}
        <div className="absolute top-12 left-6 lg:left-16 text-indigo-500/50 hidden md:block">
          <svg width="68" height="52" viewBox="0 0 68 52" fill="none">
            <path d="M34 14 C 24 6, 12 8, 4 14 V 44 C 12 38, 24 36, 34 44 C 44 36, 56 38, 64 44 V 14 C 56 8, 44 6, 34 14 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M34 14 V 44" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M12 21 C 18 17, 24 17, 28 20 M12 28 C 18 24, 24 24, 28 27 M40 20 C 44 17, 50 17, 56 21 M40 27 C 44 24, 50 24, 56 28" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="2 2" />
            {/* Tiny ray doodles */}
            <path d="M34 4 L34 8 M24 6 L26 9 M44 6 L42 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Pencil Doodle 2: Hand-Drawn Globe with Orbit Ring (Mid-Left beside Campus) */}
        <div className="absolute top-1/2 -translate-y-12 left-4 lg:left-10 text-indigo-400/45 hidden lg:block">
          <svg width="74" height="74" viewBox="0 0 74 74" fill="none">
            <circle cx="37" cy="37" r="24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M13 37 H61" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="37" cy="37" rx="14" ry="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Orbiting ring */}
            <path d="M6 46 C 14 26, 60 16, 68 28 C 62 48, 16 58, 6 46 Z" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
            <circle cx="62" cy="24" r="3" fill="#6366F1" />
          </svg>
        </div>

        {/* Pencil Doodle 3: Sketched Graduation Cap & Diploma Scroll (Bottom-Left) */}
        <div className="absolute bottom-20 left-6 lg:left-14 text-indigo-500/45 hidden sm:block">
          <svg width="72" height="56" viewBox="0 0 72 56" fill="none">
            <path d="M36 6 L66 20 L36 34 L6 20 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 25 V 40 C 16 40, 24 48, 36 48 C 48 48, 56 40, 56 40 V 25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M60 22 V 42 M57 42 H63" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>

        {/* Pencil Doodle 4: Sketched Idea Lightbulb (Bottom-Right) */}
        <div className="absolute bottom-24 right-8 lg:right-16 text-amber-500/50 hidden md:block">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 10 C 20 10, 16 18, 16 26 C 16 32, 22 36, 22 42 H 38 C 38 36, 44 32, 44 26 C 44 18, 40 10, 30 10 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 46 H36 M26 50 H34" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M26 26 L30 18 L34 26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            {/* Sparkle rays */}
            <path d="M30 3 V6 M10 16 L13 18 M50 16 L47 18 M8 30 H11 M52 30 H49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Pencil Doodle 5: Curly Hand-Drawn Arrow (Mid-Right pointing towards Campus window) */}
        <div className="absolute top-1/3 right-6 lg:right-14 text-indigo-400/50 hidden lg:block">
          <svg width="78" height="64" viewBox="0 0 78 64" fill="none">
            <path d="M68 8 C 50 2, 16 12, 22 38 C 26 52, 48 54, 56 42 C 60 34, 52 24, 38 28 C 24 32, 10 48, 6 58" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M2 50 L6 58 L14 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Pencil Doodle 6: Sketched 4-point Sparkle Stars Scattered */}
        <div className="absolute top-28 right-1/4 text-indigo-400/40 hidden sm:block">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2 C16 10, 20 16, 30 16 C 20 16, 16 22, 16 30 C 16 22, 12 16, 2 16 C 12 16, 16 10, 16 2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-purple-400/35 hidden sm:block">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2 C13 8, 17 13, 24 13 C 17 13, 13 18, 13 24 C 13 18, 9 13, 2 13 C 9 13, 13 8, 13 2 Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Editorial Section Header with Hand-Drawn Doodle Style Accents */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative">
          
          {/* Whimsical Looped Airplane Doodle Trail */}
          <div className="absolute -top-12 -right-6 sm:right-2 hidden sm:block pointer-events-none select-none z-20">
            <svg width="210" height="110" viewBox="0 0 210 110" fill="none" className="overflow-visible">
              <path
                d="M 10 90 C 55 100, 90 60, 110 30 C 125 10, 95 -5, 78 15 C 60 38, 88 70, 130 52 C 160 40, 185 18, 200 6"
                stroke="#6366F1"
                strokeWidth="1.75"
                strokeDasharray="4 4"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
              <g transform="translate(196, 2) rotate(22)">
                <path
                  d="M0 16 L20 0 L5 11 L0 16 Z"
                  fill="#4F46E5"
                  className="drop-shadow-[0_4px_10px_rgba(79,70,229,0.4)]"
                />
                <path
                  d="M5 11 L20 0 L12 18 L8 13 Z"
                  fill="#6366F1"
                />
                <path
                  d="M5 11 L8 13 L6 18 Z"
                  fill="#4338CA"
                />
              </g>
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200/80 px-3.5 py-1 text-xs font-black text-[#4F46E5] tracking-widest shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
            <span className="uppercase font-black text-[11px]">ABOUT US &amp; OUR MISSION</span>
          </div>

          {/* Doodle-Styled Headline with Hand-drawn Underline */}
          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.03em] text-slate-900 font-heading leading-[1.18] text-balance">
              We&apos;re on a Mission to Make{" "}
              <span className="relative inline-block text-[#4F46E5] whitespace-nowrap">
                Study Abroad Simple
                {/* Hand-Drawn Double Loop Sketch Underline */}
                <svg
                  className="absolute -bottom-2.5 sm:-bottom-3 left-0 w-full h-4 text-indigo-500/90 pointer-events-none select-none"
                  viewBox="0 0 250 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 3 11 Q 65 3, 125 8 T 247 7 M 12 14 Q 115 7, 238 10"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal text-balance pt-1">
            {MISSION_SECTION.description}
          </p>
        </div>

        {/* Clean, Majestic Campus Image Window with Ultra-Transparent Frosted Glass "Ready to Start?" CTA */}
        <div className="relative rounded-[28px] sm:rounded-[44px] overflow-hidden border border-slate-200/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] bg-slate-900 group min-h-[400px] sm:min-h-[500px] lg:min-h-[540px] flex items-end justify-end p-4 sm:p-8 lg:p-10">
          
          {/* Main Campus Photography - Clean, Clear, Open & Visible */}
          <Image
            src="/images/campus-hq.png"
            alt="World Class University Campus"
            fill
            priority
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
            sizes="(max-width: 1440px) 100vw, 1440px"
          />

          {/* Minimal Subtle Bottom-Right Vignette only to enhance card readability without hiding the photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

          {/* Ultra-Transparent Frosted Crystal Glass "Ready to Start?" CTA Box */}
          <div className="relative z-20 w-full max-w-[420px] rounded-[24px] sm:rounded-[28px] bg-slate-950/45 hover:bg-slate-950/55 backdrop-blur-2xl p-5 sm:p-7 border border-white/30 shadow-[0_24px_50px_rgba(0,0,0,0.45)] transition-all duration-300 space-y-3.5 sm:space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] sm:text-[10px] font-black tracking-wider text-indigo-200 uppercase bg-white/15 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/25 shadow-2xs">
                {MISSION_SECTION.ctaBanner.badge}
              </span>
              <div className="flex items-center gap-1 text-[11px] sm:text-[11.5px] font-bold text-amber-300 drop-shadow-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <h4 className="text-lg sm:text-[22px] font-black text-white font-heading leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                {MISSION_SECTION.ctaBanner.title}
              </h4>
              <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                {MISSION_SECTION.ctaBanner.description}
              </p>
            </div>

            {/* Dual Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <Link href="/login" className="w-full sm:flex-1">
                <Button size="sm" className="w-full h-11 sm:h-10 text-xs font-bold justify-center shadow-lg shadow-indigo-600/35 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white cursor-pointer">
                  {MISSION_SECTION.ctaBanner.primaryCta}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
              <a href="#packages" className="w-full sm:flex-1">
                <Button variant="outline" size="sm" className="w-full h-11 sm:h-10 text-xs font-bold text-white hover:text-white justify-center rounded-xl border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer">
                  {MISSION_SECTION.ctaBanner.secondaryCta}
                </Button>
              </a>
            </div>

          </div>

        </div>

        {/* 4 Cards Reusing the Exact "What We Do" Card Designs - 2 Side by Side on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 xl:gap-6">
          
          {/* Card 1: Students Guided */}
          <ScrollReveal variant="fade-up" delay={60}>
            <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-indigo-100/70 shadow-[0_8px_30px_rgba(79,70,229,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.16)] hover:border-indigo-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/15 via-indigo-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="space-y-2.5 sm:space-y-4 relative z-10">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <GraduationCap className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    Students Guided
                  </h3>
                  <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    Personalized academic mentorship across USA, UK, Canada, Australia &amp; Europe.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-indigo-600 hover:text-indigo-700 group/link py-0.5"
                >
                  <span className="truncate">Stories</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-indigo-200/80 shrink-0">
                  10K+
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Top Universities */}
          <ScrollReveal variant="fade-up" delay={120}>
            <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-indigo-100/70 shadow-[0_8px_30px_rgba(79,70,229,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.16)] hover:border-indigo-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/15 via-indigo-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="space-y-2.5 sm:space-y-4 relative z-10">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Building2 className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    Top Universities
                  </h3>
                  <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    Comprehensive faculties, rankings, departmental requirements &amp; lab insights.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-indigo-600 hover:text-indigo-700 group/link py-0.5"
                >
                  <span className="truncate">Database</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-indigo-200/80 shrink-0">
                  500+ Unis
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Visa Success */}
          <ScrollReveal variant="fade-up" delay={180}>
            <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-indigo-100/70 shadow-[0_8px_30px_rgba(79,70,229,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.16)] hover:border-indigo-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/15 via-indigo-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="space-y-2.5 sm:space-y-4 relative z-10">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Globe className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    Visa Success
                  </h3>
                  <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    Embassy clearance rate with interview prep &amp; financial documentation.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-indigo-600 hover:text-indigo-700 group/link py-0.5"
                >
                  <span className="truncate">Support</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-indigo-200/80 shrink-0">
                  98.4% Rate
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Student Rating */}
          <ScrollReveal variant="fade-up" delay={240}>
            <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-indigo-100/70 shadow-[0_8px_30px_rgba(79,70,229,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.16)] hover:border-indigo-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/15 via-indigo-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="space-y-2.5 sm:space-y-4 relative z-10">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Star className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2] fill-white" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    Student Rating
                  </h3>
                  <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    2,400+ verified student reviews praising our transparency and results.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-indigo-600 hover:text-indigo-700 group/link py-0.5"
                >
                  <span className="truncate">Reviews</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-indigo-200/80 shrink-0">
                  4.9 / 5
                </span>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}

