"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  Users,
  Mail,
  FileText,
  Bookmark,
  Sparkles,
  User,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Universities", href: "/universities", icon: Building2 },
  { label: "Professors", href: "/professors", icon: Users },
  { label: "Email Tracker", href: "/email-tracker", icon: Mail },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Saved Items", href: "/saved-items", icon: Bookmark },
  { label: "AI Tools", href: "/ai-tools", icon: Sparkles },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Purchase Plan", href: "/pricing", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center px-6 border-b border-slate-50">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight font-heading">
              Higher<span className="text-[#4F46E5]">Study</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#EDE9FE]/70 text-[#4F46E5] shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#4F46E5]" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Log Out */}
      <div className="p-4 border-t border-slate-50">
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 font-heading">
              Higher<span className="text-[#4F46E5]">Study</span>
            </span>
          </Link>
        </div>

        {/* Global Search bar (desktop) */}
        <div className="hidden lg:flex items-center relative w-96">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search universities, professors, or applications..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Right actions: Notifications & User profile */}
        <div className="flex items-center gap-3.5 sm:gap-4 ml-auto">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>

          {/* User profile dropdown pill */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-100 cursor-pointer group">
            <div className="h-9 w-9 rounded-full bg-indigo-100 overflow-hidden ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Ahmed Rahman"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-tight">
                Ahmed Rahman
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                PhD Applicant
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden">
          <div className="bg-white w-64 h-full p-4 flex flex-col justify-between shadow-xl">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#EDE9FE]/70 text-[#4F46E5] font-extrabold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#4F46E5]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
