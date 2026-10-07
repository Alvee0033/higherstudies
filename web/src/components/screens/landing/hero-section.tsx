import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT } from "@/data/landing-content";
import { HeroGraphic } from "./hero-graphic";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-44 md:pt-48 md:pb-24 lg:pt-52">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 xl:gap-2 items-center">
          {/* Left Column: Headline & Action Items (span 5 cols) - Order 2 on mobile, Order 1 on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5 space-y-5 sm:space-y-7 lg:pr-2 xl:pr-6 text-center lg:text-left">
            {/* Top Tag */}
            <ScrollReveal variant="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-indigo-200/80 px-3.5 py-1.5 sm:px-4 text-xs sm:text-sm font-bold text-[#4F46E5] shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all duration-300 cursor-default">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{HERO_CONTENT.badge}</span>
              </div>
            </ScrollReveal>

            {/* H1 Heading */}
            <ScrollReveal variant="fade-up" delay={80}>
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] xl:text-[60px] font-black tracking-[-0.03em] text-slate-900 leading-[1.15] sm:leading-[1.12] font-heading">
                Find the Right University. Connect with the{" "}
                <span className="text-[#4F46E5]">Right Professor.</span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal variant="fade-up" delay={140}>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
                {HERO_CONTENT.subtitle}
              </p>
            </ScrollReveal>

            {/* Dual Action Buttons */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 text-sm sm:text-base font-bold justify-center gap-2 shadow-[0_8px_24px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    {HERO_CONTENT.primaryCta}
                    <ArrowRight className="h-4 sm:h-4.5 w-4 sm:w-4.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#packages" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 text-sm sm:text-base font-bold justify-center text-slate-700 hover:text-slate-900 hover:border-indigo-300 hover:bg-white border-slate-200/90 bg-white/80 backdrop-blur-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    {HERO_CONTENT.secondaryCta}
                  </Button>
                </a>
              </div>
            </ScrollReveal>

            {/* Social Proof */}
            <ScrollReveal variant="fade-up" delay={260}>
              <div className="flex items-center justify-center lg:justify-start gap-3.5 pt-2 sm:pt-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white overflow-hidden bg-indigo-100 shadow-2xs hover:scale-110 hover:z-10 transition-transform duration-200">
                    <Image
                      src="/images/avatars/avatar-arshi.png"
                      alt="Student"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white overflow-hidden bg-purple-100 shadow-2xs hover:scale-110 hover:z-10 transition-transform duration-200">
                    <Image
                      src="/images/avatars/avatar-nusrat.png"
                      alt="Student"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white overflow-hidden bg-blue-100 shadow-2xs hover:scale-110 hover:z-10 transition-transform duration-200">
                    <Image
                      src="/images/avatars/avatar-tanvir.png"
                      alt="Student"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="font-extrabold text-slate-900">{HERO_CONTENT.socialProofCount}</span>{" "}
                  {HERO_CONTENT.socialProofText}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Graphic - Order 1 on mobile (top), Order 2 on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 flex justify-center lg:justify-end relative w-full lg:-mr-24 xl:-mr-36 2xl:-mr-52 lg:translate-x-10 xl:translate-x-16">
            <ScrollReveal variant="zoom-in" delay={120} duration={850}>
              <HeroGraphic />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
