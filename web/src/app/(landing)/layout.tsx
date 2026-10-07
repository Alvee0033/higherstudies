import * as React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAF9FE] overflow-hidden">
      {/* Global Continuous Animated Aurora Mesh Gradient Canopy across the whole landing page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Continuous Soft Lavender/Indigo Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE9FE]/40 via-[#F5F3FF]/30 to-[#EEF2FF]/40" />

        {/* Floating Animated Aurora Orb 1 (Top-Left Violet-Purple) */}
        <div className="absolute -top-[10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#DDD6FE]/65 via-[#C4B5FD]/45 to-transparent blur-[140px] animate-aurora-1" />

        {/* Floating Animated Aurora Orb 2 (Top-Right Deep Indigo Glow) */}
        <div className="absolute -top-[5%] right-[-10%] w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#818CF8]/50 via-[#A5B4FC]/40 to-transparent blur-[150px] animate-aurora-2" />

        {/* Floating Animated Aurora Orb 3 (Mid-Page Center Pastel Violet Glow) */}
        <div className="absolute top-[35%] left-[25%] w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-[#E9D5FF]/50 via-[#F3E8FF]/35 to-transparent blur-[130px] animate-aurora-3" />

        {/* Floating Animated Aurora Orb 4 (Lower Page Soft Blue/Indigo Glow) */}
        <div className="absolute top-[65%] right-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-[#C7D2FE]/55 via-[#DDD6FE]/40 to-transparent blur-[140px] animate-aurora-1" />

        {/* Floating Animated Aurora Orb 5 (Bottom Page Lavender Glow) */}
        <div className="absolute top-[85%] left-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#DDD6FE]/50 via-[#EDE9FE]/40 to-transparent blur-[130px] animate-aurora-2" />
      </div>

      <PublicNavbar />
      <main className="flex-1 relative z-10">{children}</main>
      <PublicFooter />
    </div>
  );
}
