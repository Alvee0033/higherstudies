import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9FE] relative overflow-hidden px-4 py-8 sm:py-12">
      {/* Background soft ambient glows matching landing theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#DDD6FE]/40 via-[#C4B5FD]/30 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#818CF8]/35 via-[#A5B4FC]/25 to-transparent blur-[140px]" />
      </div>

      <div className="w-full relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
