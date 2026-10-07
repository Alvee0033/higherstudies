import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function ServicesSection() {
  return (
    <section id="services" className="relative py-20 sm:py-28 overflow-visible">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(199, 210, 254, 0.45) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(199, 210, 254, 0.45) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-12 xl:px-16 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-3.5 mb-12 sm:mb-18">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200/80 px-3.5 py-1 text-xs font-black text-[#4F46E5] tracking-widest shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all duration-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
              <span className="uppercase font-black text-[11px]">OUR SERVICES</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.03em] text-slate-900 font-heading leading-[1.18] text-balance">
              We Help you to reach Your Dream{" "}
              <span className="text-[#4F46E5] block sm:inline">
                Anywhere In The World
              </span>
            </h2>

            <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed text-balance font-normal">
              Expand your horizons, immerse yourself in diverse cultures, and gain a
              world-class education that transcends boundaries.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid: 4 compact side cards (7 cols) + 1 big image-integrated card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch pt-4 sm:pt-6 lg:pt-10">
          
          {/* Left Column: 4 Clean Compact Bento Cards (Span 7 cols) - 2 Side by Side on Mobile */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-5 xl:gap-6">
            
            {/* Card 1: University Shortlisting */}
            <ScrollReveal variant="fade-up" delay={60}>
              <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-blue-100/70 shadow-[0_8px_30px_rgba(59,130,246,0.06)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.16)] hover:border-blue-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/15 via-indigo-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="space-y-2.5 sm:space-y-4 relative z-10">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 10.5V10.5M2.25 21h19.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      University Shortlisting
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                      Targeted profile matching &amp; admission odds analytics across 500+ universities.
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-blue-600 hover:text-blue-700 group/link py-0.5"
                  >
                    <span className="truncate">Explore</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-blue-700 bg-blue-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-blue-200/80 shrink-0">
                    500+ Unis
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Professor Research */}
            <ScrollReveal variant="fade-up" delay={120}>
              <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-orange-100/70 shadow-[0_8px_30px_rgba(249,115,22,0.06)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.16)] hover:border-orange-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-400/15 via-amber-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="space-y-2.5 sm:space-y-4 relative z-10">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                      Professor Research
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                      Discover active lab heads, recent grants, paper citations, and funding openings.
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-orange-600 hover:text-orange-700 group/link py-0.5"
                  >
                    <span className="truncate">Faculty</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-orange-700 bg-orange-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-orange-200/80 shrink-0">
                    10K+ Faculty
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Email & Follow-up Tracker */}
            <ScrollReveal variant="fade-up" delay={180}>
              <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-indigo-100/70 shadow-[0_8px_30px_rgba(79,70,229,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.16)] hover:border-indigo-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/15 via-violet-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="space-y-2.5 sm:space-y-4 relative z-10">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      Email &amp; Outreach
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                      Automate customized cold professor emails, read receipts, and follow-ups.
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-indigo-600 hover:text-indigo-700 group/link py-0.5"
                  >
                    <span className="truncate">Track</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-indigo-200/80 shrink-0">
                    Automated
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4: Application & Document Tracker */}
            <ScrollReveal variant="fade-up" delay={240}>
              <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-br from-white via-purple-50/20 to-fuchsia-50/30 backdrop-blur-xl p-3.5 sm:p-7 border border-purple-100/70 shadow-[0_8px_30px_rgba(168,85,247,0.06)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.16)] hover:border-purple-400/60 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/15 via-fuchsia-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="space-y-2.5 sm:space-y-4 relative z-10">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[13px] sm:text-lg font-black text-slate-900 font-heading leading-tight sm:leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                      Application Hub
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[10.5px] sm:text-[13px] text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                      Organize SOPs, LORs, transcripts, deadlines, and live milestones in one place.
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 relative z-10">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-purple-600 hover:text-purple-700 group/link py-0.5"
                  >
                    <span className="truncate">Pipeline</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-purple-700 bg-purple-100/70 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-purple-200/80 shrink-0">
                    Stages
                  </span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Hero Highlight Bento Card with EXTRUDING 3D IMAGE & TEXT IN LOWER AREA */}
          <div className="lg:col-span-5 relative mt-10 sm:mt-24 lg:mt-0 flex flex-col">
            <ScrollReveal variant="fade-left" delay={150} duration={800} className="h-full flex flex-col flex-1">
              {/* The Main Bento Card Container */}
              <div className="group relative flex-1 flex flex-col justify-between rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-white/95 via-indigo-50/40 to-purple-50/60 backdrop-blur-2xl p-5 sm:p-9 border border-indigo-200/90 shadow-[0_16px_48px_rgba(79,70,229,0.12)] hover:shadow-[0_28px_64px_rgba(79,70,229,0.18)] hover:border-indigo-400/90 transition-all duration-300 min-h-[500px] sm:min-h-[550px] lg:min-h-full">
              
              {/* Dynamic Gradient Wave Backing */}
              <div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/50 via-white/30 to-transparent pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-gradient-to-tr from-indigo-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* The BIG Extruding 3D Image popping out from the top & side (z-10 layer) */}
              <div className="pointer-events-none absolute -top-8 xs:-top-14 sm:-top-32 lg:-top-36 -right-2 xs:-right-4 sm:-right-10 lg:-right-12 w-[330px] xs:w-[380px] sm:w-[450px] lg:w-[500px] xl:w-[540px] aspect-square z-10 select-none">
                <Image
                  src="/images/landing/services-banner.png"
                  alt="Visa & Pre-Departure Assistance"
                  fill
                  priority
                  sizes="(max-width: 640px) 380px, (max-width: 1024px) 450px, 540px"
                  className="object-contain drop-shadow-[0_24px_48px_rgba(79,70,229,0.25)] group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Lower Mid Area: Semi-Transparent Frosted Glass Content Panel */}
              <div className="relative z-30 mt-auto pt-28 xs:pt-36 sm:pt-36 space-y-3.5 sm:space-y-4">
                
                {/* Semi-Transparent Frosted Glass Banner */}
                <div className="rounded-2xl sm:rounded-3xl bg-white/75 hover:bg-white/85 backdrop-blur-xl p-4 sm:p-6 border border-white/80 shadow-[0_8px_32px_rgba(79,70,229,0.08)] transition-all duration-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2] transform -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Priority Support
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-[26px] font-black text-slate-900 font-heading leading-tight tracking-tight">
                    Visa &amp; Pre-Departure
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    End-to-end embassy preparation, mock visa interviews, discounted flight ticketing, and housing setup.
                  </p>
                </div>

                {/* Bottom Row: CTA Button + Metrics Chips In The Empty Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <Link href="/login" className="w-full sm:w-auto inline-block">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-violet-600 text-white text-xs sm:text-sm font-black shadow-[0_10px_26px_rgba(79,70,229,0.38)] hover:shadow-[0_14px_32px_rgba(79,70,229,0.48)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer">
                      <span>Enquire Now</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </Link>

                  {/* Badges Placed in the Empty Bottom Right Space */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-white/75 backdrop-blur-md text-[10.5px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>99.4% Visa Rate</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-white/75 backdrop-blur-md text-[10.5px] sm:text-[11px] font-bold text-indigo-700 border border-indigo-200/80 shadow-2xs">
                      <Globe className="h-3.5 w-3.5 text-indigo-600" />
                      <span>30+ Countries</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
