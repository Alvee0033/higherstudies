import * as React from "react";
import Image from "next/image";
import { Globe, Cpu } from "lucide-react";

export function HeroGraphic() {
  return (
    <div className="relative w-full max-w-[760px] lg:max-w-none flex items-center justify-center lg:justify-end select-none">
      {/* Background organic lavender/indigo fluid glow */}
      <div className="absolute inset-0 -m-10 rounded-[64px] bg-gradient-to-tr from-[#EDE9FE]/90 via-[#F5F3FF]/90 to-[#EEF2FF]/80 blur-3xl pointer-events-none" />

      {/* Floating Badge 1: Top Universities Worldwide */}
      <div className="absolute top-1 left-1 sm:top-2 sm:left-4 lg:left-6 z-20 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:px-4.5 sm:py-3 shadow-[0_12px_32px_rgba(79,70,229,0.18)] border border-white/90 animate-bounce [animation-duration:4s]">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#EDE9FE] text-[#4F46E5] shadow-2xs">
          <Globe className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
        </div>
        <div className="text-left">
          <p className="text-[11px] sm:text-sm font-bold text-slate-900 leading-tight">
            Top Universities
          </p>
          <p className="text-[9.5px] sm:text-[11px] font-medium text-slate-500">
            Worldwide
          </p>
        </div>
      </div>

      {/* Floating Badge 2: AI Powered Recommendations */}
      <div className="absolute bottom-2 right-1 sm:bottom-4 sm:right-4 lg:right-2 z-20 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:px-4.5 sm:py-3 shadow-[0_12px_32px_rgba(79,70,229,0.18)] border border-white/90 animate-bounce [animation-duration:5s]">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#EDE9FE] text-[#4F46E5] shadow-2xs">
          <Cpu className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
        </div>
        <div className="text-left">
          <p className="text-[11px] sm:text-sm font-bold text-slate-900 leading-tight">
            AI Powered
          </p>
          <p className="text-[9.5px] sm:text-[11px] font-medium text-slate-500">
            Recommendations
          </p>
        </div>
      </div>

      {/* Main 3D Hero Graphic - Enlarged and positioned right */}
      <div className="relative z-10 w-full flex items-center justify-center lg:justify-end">
        <Image
          src="/images/hero-illustration-cropped.png"
          alt="HigherStudy Student Success Illustration"
          width={1898}
          height={1302}
          priority
          className="w-full h-auto max-h-[540px] sm:max-h-[600px] lg:max-h-[660px] xl:max-h-[700px] object-contain drop-shadow-[0_20px_48px_rgba(79,70,229,0.16)] transform hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
}
