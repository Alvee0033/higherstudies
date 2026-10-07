import * as React from "react";
import Link from "next/link";
import { GraduationCap, Send } from "lucide-react";
import { FOOTER_CONTENT } from "@/data/landing-content";

// Custom clean SVG icons for social channels
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative bg-transparent text-white overflow-visible pt-20 sm:pt-24 pb-10 mt-14 sm:mt-18">
      
      {/* ================= 100% UNIFIED SEAMLESS U-CURVE ARCH & GRID BACKGROUND ================= */}
      <div className="absolute -top-12 sm:-top-16 lg:-top-20 inset-x-0 bottom-0 pointer-events-none select-none z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Single Continuous Architectural Grid covering the entire shape */}
            <pattern
              id="footer-unified-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="rgba(255, 255, 255, 0.13)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* 1. Seamless Solid Brand Color Base (Curves at top, flat at bottom) */}
          <path
            d="M0,0 C400,75 1040,75 1440,0 L1440,900 L0,900 Z"
            fill="#322BB3"
          />

          {/* 2. Seamless Continuous Grid filling the exact same path */}
          <path
            d="M0,0 C400,75 1040,75 1440,0 L1440,900 L0,900 Z"
            fill="url(#footer-unified-grid)"
          />
        </svg>

        {/* Ambient Radial Lighting Glows */}
        <div className="absolute top-10 right-1/4 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-purple-400/15 blur-3xl pointer-events-none" />

        {/* --- PENCIL DOODLE 1: Flying Paper Airplane with Long Curly Dashed Trail --- */}
        <div className="absolute top-14 sm:top-16 left-8 lg:left-24 text-indigo-200/50 hidden sm:block pointer-events-none">
          <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
            <path
              d="M 10 65 C 40 70, 65 40, 80 20 C 90 5, 70 0, 60 12 C 50 25, 70 45, 100 32 C 120 22, 135 10, 145 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            <g transform="translate(140, 2) rotate(18)">
              <path d="M0 12 L16 0 L4 8 L0 12 Z" fill="#FFFFFF" opacity="0.75" />
              <path d="M4 8 L16 0 L10 14 L7 10 Z" fill="#C7D2FE" opacity="0.6" />
            </g>
          </svg>
        </div>

        {/* --- PENCIL DOODLE 2: Sketched Graduation Mortarboard (Top-Right) --- */}
        <div className="absolute top-14 sm:top-16 right-12 lg:right-32 text-indigo-200/45 hidden md:block pointer-events-none">
          <svg width="54" height="42" viewBox="0 0 54 42" fill="none">
            <path d="M27 4 L50 15 L27 26 L4 15 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19 V 30 C 12 30, 18 36, 27 36 C 36 36, 42 30, 42 30 V 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M46 17 V 33 M44 33 H48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* --- PENCIL DOODLE 3: Sketched 4-point Sparkle Stars & Sparkles --- */}
        <div className="absolute top-32 left-1/3 text-indigo-300/50 hidden lg:block pointer-events-none">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2 C15 9, 19 15, 28 15 C 19 15, 15 21, 15 28 C 15 21, 11 15, 2 15 C 11 15, 15 9, 15 2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-1/4 text-indigo-300/40 hidden sm:block pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 C12 7, 15 12, 22 12 C 15 12, 12 17, 12 22 C 12 17, 9 12, 2 12 C 9 12, 12 7, 12 2 Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* --- PENCIL DOODLE 4: Hand-drawn Swirl Spiral (Bottom Left) --- */}
        <div className="absolute bottom-10 left-10 text-indigo-200/40 hidden lg:block pointer-events-none">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <path d="M 21 21 m 0 -3 a 3 3 0 0 1 3 3 a 6 6 0 0 1 -6 6 a 9 9 0 0 1 -9 -9 a 12 12 0 0 1 12 -12 a 15 15 0 0 1 15 15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
          </svg>
        </div>

        {/* --- PENCIL DOODLE 5: Sketched Arrow pointing toward Newsletter --- */}
        <div className="absolute bottom-28 right-10 text-indigo-300/50 hidden xl:block pointer-events-none">
          <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
            <path d="M 10 40 C 25 35, 45 35, 48 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M 40 22 L 48 16 L 52 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-14 border-b border-indigo-400/20">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#322BB3] shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                HigherStudy
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed font-normal">
              {FOOTER_CONTENT.tagline}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1 sm:pt-2">
              <a
                href="#"
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-100 transition-colors hover:bg-white hover:text-[#322BB3]"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-100 transition-colors hover:bg-white hover:text-[#322BB3]"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-100 transition-colors hover:bg-white hover:text-[#322BB3]"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-100 transition-colors hover:bg-white hover:text-[#322BB3]"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-indigo-200/80">
              {FOOTER_CONTENT.quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors py-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-indigo-200/80">
              {FOOTER_CONTENT.resources.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors py-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-indigo-200/80">
              {FOOTER_CONTENT.support.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors py-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Newsletter
            </h4>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              {FOOTER_CONTENT.newsletterText}
            </p>
            <div className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-11 rounded-full bg-indigo-900/60 border border-indigo-400/30 px-4 py-2.5 text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-11"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#4F46E5] text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-indigo-200/70 gap-3 sm:gap-0 text-center sm:text-left">
          <p>{FOOTER_CONTENT.copyright}</p>
          <div className="flex items-center gap-2 opacity-70">
            <span>🎓 Built for aspiring scholars worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
