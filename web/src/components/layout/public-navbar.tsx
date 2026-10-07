"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "About Us", href: "#about" },
  { label: "Success Stories", href: "#success-stories" },
  { label: "Contact", href: "#contact" },
];

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 ${
        scrolled ? "pt-3 pb-1" : "pt-4 sm:pt-6 pb-2"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "max-w-[1140px] h-14 px-5 sm:px-6 rounded-full bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(79,70,229,0.08),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/5"
            : "max-w-[1440px] h-16 px-4 sm:px-8 rounded-2xl bg-transparent"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={`flex items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] transition-all group-hover:scale-105 ${
              scrolled ? "h-8 w-8" : "h-9 w-9"
            }`}
          >
            <GraduationCap className={scrolled ? "h-4.5 w-4.5" : "h-5 w-5"} />
          </div>
          <span
            className={`font-black tracking-tight text-slate-900 font-heading transition-all ${
              scrolled ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            HigherStudy
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:text-[#4F46E5]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className={`font-semibold text-slate-700 hover:text-slate-900 border-slate-200/80 transition-all ${
                scrolled ? "h-8.5 px-4 text-xs rounded-full" : "h-9.5 px-5 text-sm rounded-xl"
              }`}
            >
              Log in
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="primary"
              size="sm"
              className={`font-bold shadow-md shadow-indigo-500/20 transition-all ${
                scrolled ? "h-8.5 px-5 text-xs rounded-full" : "h-9.5 px-6 text-sm rounded-xl"
              }`}
            >
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-9.5 w-9.5 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
        </button>
      </div>

      {/* Mobile Drawer with Rich Touch Ergonomics */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-[1140px] rounded-2xl border border-indigo-100/80 bg-white/95 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl ring-1 ring-slate-900/5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#4F46E5] hover:bg-indigo-50/70 active:bg-indigo-100/80 px-3.5 py-2.5 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-1 flex flex-col gap-2.5 border-t border-slate-100">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="outline" className="w-full h-11 text-xs font-bold justify-center rounded-xl border-slate-200 bg-white text-slate-700">
                  Log in
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" className="w-full h-11 text-xs font-bold justify-center rounded-xl shadow-md shadow-indigo-500/25 bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
