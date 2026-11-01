"use client";

import * as React from "react";
import Link from "next/link";
import {useStudent,logout} from "./student-session";
import { useRouter } from "next/navigation";
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
  CircleHelp,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Universities", href: "/universities", icon: Building2 },
  { label: "Programs", href: "/programs", icon: BookOpen },
  { label: "Professors", href: "/professors", icon: Users },
  { label: "Messages", href: "/email-tracker", icon: Mail },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Saved", href: "/saved-items", icon: Bookmark },
  { label: "AI Tools", href: "/ai-tools", icon: Sparkles },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Purchase Plan", href: "/pricing", icon: CreditCard },
];

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  universities: { title: "Discover world-class universities", description: "Explore universities around the world and find your perfect fit." },
  programs: { title: "Find your ideal programme", description: "Explore graduate programmes with source-attributed details." },
  professors: { title: "Connect with leading researchers", description: "Discover faculty members, their work, and public institutional contacts." },
  "email-tracker": { title: "Keep every conversation moving", description: "Organize your outreach and stay on top of follow-ups." },
  applications: { title: "Your application journey", description: "Track every milestone, document, and upcoming deadline." },
  "saved-items": { title: "Your saved discoveries", description: "Return to the institutions and researchers that inspire you." },
  "ai-tools": { title: "Write with confidence", description: "Prepare thoughtful outreach drafts for your next opportunity." },
  profile: { title: "Your student profile", description: "Keep your academic story and study preferences up to date." },
  settings: { title: "Make HigherStudy yours", description: "Manage your account, notifications, and privacy preferences." },
  pricing: { title: "Choose your path forward", description: "Explore the plan that fits your study journey." },
};

export function ClientPageBanner() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment || segment === "dashboard") return null;
  const copy = PAGE_COPY[segment];
  if (!copy) return null;
  return (
    <div className="client-page-banner mb-5 sm:mb-6">
      <div className="relative z-10 max-w-2xl">
        <span className="client-eyebrow">HigherStudy workspace</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [error,setError]=React.useState("");
  const pathname = usePathname();

  return (
    <aside className="client-sidebar w-56 shrink-0 bg-white flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#1476f2] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-[15px] text-[#0a3670] tracking-tight font-heading">
              Higher<span className="text-[#1476f2]">Study</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-152px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#dceeff] text-[#1476f2] shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#1476f2]" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom tools */}
      <div className="p-3 border-t border-[#e2edfc]">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#1476f2] hover:bg-[#edf6ff]"><CircleHelp className="h-4 w-4" />Help &amp; Support</Link>
        <button
          onClick={()=>void logout().catch((e:Error)=>setError(e.message))}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
          <span>Log Out</span>
        </button>
        {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      </div>
    </aside>
  );
}

export function DashboardHeader() {
  const {user}=useStudent();
  const router=useRouter();
  const [notice,setNotice]=React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="client-header h-16 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
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
            <div className="h-8 w-8 rounded-lg bg-[#1476f2] flex items-center justify-center text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 font-heading">
              Higher<span className="text-[#1476f2]">Study</span>
            </span>
          </Link>
        </div>

        {/* Global Search bar (desktop) - hidden on pages like /pricing to match Figma */}
        {pathname !== "/pricing" && (
          <div className="hidden lg:flex items-center relative w-[min(34rem,55%)]">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              onKeyDown={e=>{if(e.key==="Enter")router.push(`/professors?q=${encodeURIComponent(e.currentTarget.value)}`);}}
              placeholder="Search universities, professors, or applications..."
              className="w-full h-9 pl-10 pr-4 rounded-full bg-[#f0f6ff] border border-[#e4efff] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1476f2] focus:bg-white transition-all"
            />
          </div>
        )}

        {/* Right actions: Notifications & User profile */}
        <div className="flex items-center gap-3.5 sm:gap-4 ml-auto">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Notifications"
            onClick={()=>setNotice(notice?"":"No notifications yet.")}
          >
            <Bell className="h-5 w-5" />
          </button>

          {notice && <p role="status" className="text-xs text-slate-500">{notice}</p>}
          {/* User profile dropdown pill */}
          <Link href="/profile" className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-100 cursor-pointer group">
            <div className="h-9 w-9 rounded-full bg-indigo-100 overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all shrink-0">
              <span className="h-full w-full flex items-center justify-center text-indigo-600 font-bold">{user.displayName.slice(0,1).toUpperCase()}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1476f2] transition-colors leading-tight">
                {user.displayName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {user.email}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden">
          <div className="bg-white w-64 h-full p-4 flex flex-col justify-between shadow-xl">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#dceeff] text-[#1476f2] font-extrabold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#1476f2]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={()=>void logout().catch((e:Error)=>setNotice(e.message))}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
