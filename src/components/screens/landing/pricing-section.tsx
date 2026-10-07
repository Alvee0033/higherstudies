"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PACKAGES_SECTION } from "@/data/landing-content";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(false);
  const [activeCardIndex, setActiveCardIndex] = React.useState(1); // Default to popular plan
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const totalPlans = PACKAGES_SECTION.plans.length;

  // Manual scroll to specific card index
  const scrollToIndex = React.useCallback((index: number) => {
    const targetIndex = (index + totalPlans) % totalPlans;
    setActiveCardIndex(targetIndex);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const card = container.children[targetIndex] as HTMLElement;
      if (card) {
        const leftPos = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
        container.scrollTo({ left: Math.max(0, leftPos), behavior: "smooth" });
      }
    }
  }, [totalPlans]);

  // Handle manual scroll update for active dot
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.clientWidth || 300;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < totalPlans && newIndex !== activeCardIndex) {
      setActiveCardIndex(newIndex);
    }
  };

  return (
    <section id="packages" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-12 xl:px-16 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 border border-indigo-200/80 px-3.5 py-1 text-xs font-black text-[#4F46E5] tracking-widest shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all duration-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
              <span className="uppercase font-black text-[11px]">TRANSPARENT PRICING</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight text-balance">
              Choose the Perfect Plan for{" "}
              <span className="text-[#4F46E5]">
                Your Journey
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed text-balance">
              Simple, transparent pricing designed for students. Pick what works best for you.
            </p>

            {/* Clean Minimalist Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-slate-100/90 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    !isAnnual
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Seasonal
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isAnnual
                      ? "bg-[#4F46E5] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Full Year</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isAnnual ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
                  >
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ================= DESKTOP VIEW: 4 Clean Professional Cards Grid (lg:grid) ================= */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5 xl:gap-6 items-stretch">
          {PACKAGES_SECTION.plans.map((plan, index) => {
            const displayPrice = isAnnual && plan.priceBDT > 0
              ? Math.round(plan.priceBDT * 0.8)
              : plan.priceBDT;

            return (
              <ScrollReveal key={plan.id} variant="fade-up" delay={index * 80} className="h-full flex flex-col">
                <div
                  className="group relative flex flex-col justify-between h-full"
                >
                {/* Ambient Under-Glow Halo on Hover */}
                <div
                  className={`absolute -inset-0.5 rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10 ${
                    plan.isPopular
                      ? "bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-indigo-600/40 opacity-70 group-hover:opacity-100"
                      : "bg-gradient-to-r from-indigo-400/20 via-blue-400/20 to-purple-400/20"
                  }`}
                />

                <div
                  className={`relative z-10 flex flex-col justify-between h-full rounded-3xl p-5 sm:p-7 transition-all duration-300 ${
                    plan.isPopular
                      ? "bg-white border-2 border-[#4F46E5] shadow-[0_12px_36px_rgba(79,70,229,0.14)] lg:-translate-y-2 lg:group-hover:-translate-y-3"
                      : "bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-indigo-300 hover:shadow-[0_14px_32px_rgba(79,70,229,0.09)] group-hover:-translate-y-1.5"
                  }`}
                >
                  {/* Popular Pill Floating on Top */}
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-block bg-[#4F46E5] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Plan Name & Subtitle */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                      {plan.subtitle}
                    </p>

                    {/* Price */}
                    <div className="mt-3.5 sm:mt-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-[34px] font-black text-slate-900 tracking-tight">
                          {displayPrice === 0 ? "0" : displayPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          BDT
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          {plan.priceBDT === 0 ? "/ forever" : isAnnual ? "/ year" : "/ season"}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mb-5 sm:mb-6">
                      <Link href="/login" className="w-full block">
                        <button
                          className={`w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            plan.isPopular
                              ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-500/20"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          <span>{plan.ctaText}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        FEATURES
                      </p>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                            <Check className="h-3.5 w-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

        {/* ================= MOBILE/TABLET VIEW: Smooth Swipeable Carousel ================= */}
        <ScrollReveal variant="fade-up" delay={100} className="block lg:hidden relative">
          {/* Scrollable Container with Pure CSS Edge Fade Mask */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)",
            }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-5 pb-6 px-4 -mx-4 scrollbar-none items-stretch scroll-smooth"
          >
            {PACKAGES_SECTION.plans.map((plan, index) => {
              const displayPrice = isAnnual && plan.priceBDT > 0
                ? Math.round(plan.priceBDT * 0.8)
                : plan.priceBDT;
              const isSelected = activeCardIndex === index;

              return (
                <div
                  key={plan.id}
                  className="w-[82vw] xs:w-[290px] sm:w-[320px] shrink-0 snap-center relative flex flex-col justify-between"
                >
                  {/* Under-Glow */}
                  <div
                    className={`absolute -inset-0.5 rounded-[26px] transition-opacity duration-300 blur-lg pointer-events-none -z-10 ${
                      plan.isPopular || isSelected
                        ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 opacity-100"
                        : "opacity-0"
                    }`}
                  />

                  <div
                    className={`relative z-10 flex flex-col justify-between h-full rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
                      plan.isPopular
                        ? "bg-white border-2 border-[#4F46E5] shadow-[0_12px_36px_rgba(79,70,229,0.14)]"
                        : "bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {/* Popular Pill */}
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-block bg-[#4F46E5] text-white text-[9.5px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Plan Name & Subtitle */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 font-heading">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 min-h-[30px]">
                        {plan.subtitle}
                      </p>

                      {/* Price */}
                      <div className="mt-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {displayPrice === 0 ? "0" : displayPrice.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            BDT
                          </span>
                          <span className="text-xs text-slate-400 font-normal">
                            {plan.priceBDT === 0 ? "/ forever" : isAnnual ? "/ year" : "/ season"}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mb-5">
                        <Link href="/login" className="w-full block">
                          <button
                            className={`w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              plan.isPopular
                                ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-500/20"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                            }`}
                          >
                            <span>{plan.ctaText}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          FEATURES
                        </p>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                              <Check className="h-3.5 w-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Pagination Controls (Dots + Counter) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {PACKAGES_SECTION.plans.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className="p-2 cursor-pointer inline-flex items-center justify-center"
                aria-label={`Go to plan ${idx + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCardIndex === idx
                      ? "w-7 bg-[#4F46E5] shadow-[0_0_8px_rgba(79,70,229,0.6)]"
                      : "w-2 bg-indigo-200/80 hover:bg-indigo-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
