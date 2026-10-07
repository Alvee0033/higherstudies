"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  WHY_CHOOSE_SECTION,
  TESTIMONIALS_SECTION,
} from "@/data/landing-content";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// Custom polished icons matching the design
function getWhyChooseIcon(index: number) {
  switch (index) {
    case 0:
      return (
        <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      );
    case 1:
      return (
        <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 10.5V10.5M2.25 21h19.5" />
        </svg>
      );
    case 2:
      return (
        <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      );
    case 3:
      return (
        <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      );
    case 4:
    default:
      return (
        <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871a2.625 2.625 0 0 0-2.404-1.625h-.6a2.625 2.625 0 0 0-2.404 1.625h-.871c-.622 0-1.125.504-1.125 1.125v3.375m9 0h-9M12 9a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
        </svg>
      );
  }
}

export function TrustAndReviewsSection() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const totalSlides = TESTIMONIALS_SECTION.reviews.length;

  // Auto-scroll through reviews smoothly every 3.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section id="success-stories" className="py-10 sm:py-14 relative overflow-visible">
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-purple-300/20 via-indigo-300/15 to-sky-200/20 blur-[140px] rounded-full" />
      </div>

      <div className="mx-auto max-w-[1520px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        <ScrollReveal variant="zoom-in" duration={800}>
          {/* Main Mother Card - Compact Height & Professional Aesthetic */}
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-sky-50/40 border border-indigo-100/90 px-6 py-6 sm:px-9 sm:py-7 lg:px-11 lg:py-7 shadow-[0_10px_36px_rgba(79,70,229,0.06)] overflow-visible">
          
          {/* Corner Wave Aesthetic Graphic (Bottom-Left) */}
          <div className="absolute -bottom-1 -left-1 w-32 sm:w-40 h-32 sm:h-40 pointer-events-none select-none z-0 overflow-hidden rounded-bl-[32px] sm:rounded-bl-[40px]">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
              <path d="M-20 220C20 180 50 140 30 90C10 40 -10 30 -20 20V220Z" fill="url(#cornerGrad1)" />
              <path d="M-20 220C40 200 80 160 65 110C50 60 20 40 -20 30V220Z" fill="url(#cornerGrad2)" opacity="0.7" />
              <path d="M-20 220C60 210 110 175 90 130C70 85 40 60 -20 45V220Z" fill="url(#cornerGrad3)" opacity="0.4" />
              <defs>
                <linearGradient id="cornerGrad1" x1="0" y1="0" x2="150" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#C084FC" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="cornerGrad2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#A855F7" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="cornerGrad3" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#EC4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Corner Wave Aesthetic Graphic (Bottom-Right) */}
          <div className="absolute -bottom-1 -right-1 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none select-none z-0 overflow-hidden rounded-br-[32px] sm:rounded-br-[40px]">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50 scale-x-[-1]">
              <path d="M-20 220C30 190 70 150 50 100C30 50 0 40 -20 30V220Z" fill="url(#cornerGrad1)" />
              <path d="M-20 220C50 210 95 170 80 120C65 70 30 50 -20 40V220Z" fill="url(#cornerGrad2)" opacity="0.6" />
            </svg>
          </div>

          {/* Whimsical Flight Trail & Mini Jet doodle in the top-center */}
          <div className="absolute top-3 left-1/2 -translate-x-12 hidden md:block pointer-events-none select-none z-0 opacity-40">
            <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
              <path d="M10 45 C 50 10, 90 60, 150 20" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M152 18 L 160 14 L 157 24 Z" fill="#6366F1" />
            </svg>
          </div>

          {/* Colorful Decorative Gradient Bubbles / Aurora Orbs */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-purple-400/15 via-pink-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
          <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-indigo-400/15 via-sky-300/10 to-purple-300/10 rounded-full blur-3xl pointer-events-none -mb-32" />

          {/* Elegant Geometric Dotted & Diagonal Grid Texture Overlay */}
          <div 
            className="absolute inset-0 rounded-[32px] sm:rounded-[40px] opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.14) 1.2px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Grid Layout: Left Content + Giant Student Graphic, Right Animated Testimonial Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-center relative z-10">
            
            {/* LEFT HALF (Span 6 cols) - Desktop Layout Intact, Mobile Redesigned */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between relative">
              
              {/* Row with Title + Huge Extruded Image side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-3 items-center">
                
                {/* Title + Feature checklist (sm:col-span-5, lg:col-span-5) */}
                <div className="sm:col-span-5 space-y-3 relative z-20 text-center sm:text-left">
                  <div className="space-y-1.5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-indigo-200/90 px-3 py-0.5 text-[10.5px] font-black text-[#4F46E5] tracking-wider uppercase shadow-2xs backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                      <span>WHY CHOOSE US</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-[28px] xl:text-[32px] font-black tracking-tight text-slate-900 font-heading leading-[1.14]">
                      {WHY_CHOOSE_SECTION.title}
                    </h2>
                  </div>

                  {/* Checklist items: Clean single-column layout so all text is 100% visible with zero truncation */}
                  <div className="flex flex-col gap-2 pt-2 sm:pt-0.5 text-left w-full">
                    {WHY_CHOOSE_SECTION.items.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-2.5 group p-2 sm:p-0.5 rounded-xl bg-white/70 sm:bg-transparent border border-indigo-100/70 sm:border-transparent hover:bg-white/90 transition-all duration-200"
                      >
                        <div className="h-7 w-7 sm:h-6.5 sm:w-6.5 rounded-lg bg-white border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#4F46E5] group-hover:text-white transition-all duration-200">
                          {getWhyChooseIcon(idx % 5)}
                        </div>
                        <span className="text-[12px] sm:text-[12px] font-bold text-slate-800 leading-snug group-hover:text-[#4F46E5] transition-colors">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MASSIVE Extruding Student Graphic - Big & Beautiful on Mobile, Shifted Right & Down on Desktop (sm:col-span-7) */}
                <div className="sm:col-span-7 flex justify-center sm:justify-end relative z-10 pt-4 sm:pt-0">
                  {/* Multi-layered soft aura bubble behind character */}
                  <div className="absolute inset-0 m-auto w-[280px] xs:w-[330px] sm:w-[460px] lg:w-[540px] h-[280px] xs:h-[330px] sm:h-[460px] lg:h-[540px] bg-gradient-to-tr from-purple-400/30 via-indigo-300/35 to-pink-300/25 rounded-full blur-3xl -z-10" />
                  
                  {/* Giant Graphic with extruded 3D effect */}
                  <div className="relative w-[280px] xs:w-[340px] sm:w-[440px] md:w-[500px] lg:w-[570px] xl:w-[630px] aspect-square -mt-2 sm:mt-0 lg:mt-2 -mb-6 sm:-mb-10 lg:-mb-12 mr-0 sm:-mr-8 lg:-mr-12 xl:-mr-14 select-none pointer-events-none group">
                    <Image
                      src="/images/review.png"
                      alt="HigherStudy Student - Dream Study Achieve"
                      fill
                      sizes="(max-width: 640px) 340px, (max-width: 1024px) 500px, 630px"
                      className="object-contain drop-shadow-[0_24px_48px_rgba(79,70,229,0.3)] hover:scale-105 transition-transform duration-700 ease-out pointer-events-auto"
                      priority
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT HALF: Success Stories from Around the World (Span 6 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-3 lg:pl-2 pt-6 sm:pt-0">
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-indigo-200/90 px-3 py-0.5 text-[10.5px] font-black text-[#4F46E5] tracking-wider uppercase shadow-2xs backdrop-blur-md">
                    <span>{TESTIMONIALS_SECTION.badge}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-[28px] xl:text-[32px] font-black tracking-tight text-slate-900 font-heading leading-[1.15]">
                    {TESTIMONIALS_SECTION.title}
                  </h2>
                </div>
              </div>

              {/* 3 Review Cards Grid on Desktop, Swipeable Snap Row on Mobile */}
              <div className="flex md:grid md:grid-cols-3 gap-3 items-stretch pt-1 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
                {TESTIMONIALS_SECTION.reviews.map((rev, index) => {
                  const isCurrentActive = activeSlide === index;

                  // Distinct, sophisticated underglow & accent palette for each card
                  const cardStyles = [
                    {
                      // Card 1: Electric Indigo
                      borderActive: "border-indigo-500 ring-1 ring-indigo-400/30",
                      borderHover: "hover:border-indigo-300",
                      underglowActive: "shadow-[0_12px_28px_rgba(99,102,241,0.22)]",
                      underglowHover: "hover:shadow-[0_8px_20px_rgba(99,102,241,0.12)]",
                      topLine: "bg-indigo-500",
                      badgeActive: "bg-indigo-50 text-indigo-700 border border-indigo-200/80",
                      avatarRingActive: "ring-indigo-500",
                      nameActive: "text-indigo-600",
                    },
                    {
                      // Card 2: Royal Purple / Violet
                      borderActive: "border-purple-500 ring-1 ring-purple-400/30",
                      borderHover: "hover:border-purple-300",
                      underglowActive: "shadow-[0_12px_28px_rgba(168,85,247,0.22)]",
                      underglowHover: "hover:shadow-[0_8px_20px_rgba(168,85,247,0.12)]",
                      topLine: "bg-purple-500",
                      badgeActive: "bg-purple-50 text-purple-700 border border-purple-200/80",
                      avatarRingActive: "ring-purple-500",
                      nameActive: "text-purple-600",
                    },
                    {
                      // Card 3: Sky / Azure Blue
                      borderActive: "border-sky-500 ring-1 ring-sky-400/30",
                      borderHover: "hover:border-sky-300",
                      underglowActive: "shadow-[0_12px_28px_rgba(14,165,233,0.22)]",
                      underglowHover: "hover:shadow-[0_8px_20px_rgba(14,165,233,0.12)]",
                      topLine: "bg-sky-500",
                      badgeActive: "bg-sky-50 text-sky-700 border border-sky-200/80",
                      avatarRingActive: "ring-sky-500",
                      nameActive: "text-sky-600",
                    },
                  ];
                  const style = cardStyles[index % cardStyles.length];

                  return (
                    <div
                      key={rev.id}
                      onClick={() => setActiveSlide(index)}
                      className={`w-[78vw] xs:w-[270px] md:w-auto shrink-0 snap-center group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                        isCurrentActive
                          ? `bg-white ${style.borderActive} ${style.underglowActive} -translate-y-1 md:-translate-y-1.5 z-20`
                          : `bg-white/90 hover:bg-white border-indigo-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] ${style.borderHover} ${style.underglowHover} hover:-translate-y-0.5 z-10`
                      }`}
                    >
                      {/* Delicate 1px Top Hairline Border Accent on Active */}
                      <div className={`absolute inset-x-0 top-0 h-[1px] ${style.topLine} transition-opacity duration-300 ${isCurrentActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />

                      <div className="space-y-2.5 relative z-10">
                        {/* 5 Stars + Verified Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full transition-colors ${
                            isCurrentActive 
                              ? style.badgeActive 
                              : "bg-slate-100 text-slate-600 border border-slate-200/60"
                          }`}>
                            Verified
                          </span>
                        </div>

                        {/* Review Quote */}
                        <p className={`text-xs sm:text-[12.5px] leading-relaxed transition-colors ${
                          isCurrentActive ? "text-slate-900 font-medium" : "text-slate-600 group-hover:text-slate-900"
                        }`}>
                          &quot;{rev.quote}&quot;
                        </p>
                      </div>

                      {/* Reviewer Profile */}
                      <div className="flex items-center gap-2.5 pt-3 mt-3 border-t border-slate-100 relative z-10">
                        <div className={`h-8 w-8 rounded-full overflow-hidden bg-indigo-50 shrink-0 ring-1.5 transition-all duration-300 ${
                          isCurrentActive ? style.avatarRingActive : "ring-slate-200 group-hover:ring-slate-300"
                        }`}>
                          <Image
                            src={rev.avatarSrc}
                            alt={rev.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className={`text-xs font-bold font-heading truncate transition-colors ${
                            isCurrentActive ? style.nameActive : "text-slate-900 group-hover:text-slate-900"
                          }`}>
                            {rev.name}
                          </h4>
                          <p className="text-[10.5px] font-medium text-slate-500 truncate">
                            {rev.university}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Automatic Page Indicator Dots with Synchronized Active State */}
              <div className="flex justify-center items-center gap-2 pt-2 pb-1">
                {TESTIMONIALS_SECTION.reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className="p-2 cursor-pointer inline-flex items-center justify-center"
                    aria-label={`Slide ${idx + 1}`}
                  >
                    <span className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeSlide === idx
                        ? "w-7 bg-[#4F46E5] shadow-[0_0_10px_rgba(79,70,229,0.7)]"
                        : "w-2 bg-indigo-200/80 hover:bg-indigo-300"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
}
