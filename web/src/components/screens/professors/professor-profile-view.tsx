"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft } from "lucide-react";
import { getProfessorProfile } from "./profile/profile-data";
import { ProfileHeroCard } from "./profile/profile-hero-card";
import { ProfileAboutCard } from "./profile/profile-about-card";
import { ProfileExperienceCard } from "./profile/profile-experience-card";
import { ProfileResearchAreasCard } from "./profile/profile-research-areas-card";
import { ProfilePublicationsCard } from "./profile/profile-publications-card";
import { ProfileContactCard } from "./profile/profile-contact-card";
import { ProfileAtAGlanceCard } from "./profile/profile-at-a-glance-card";
import { ProfileOpenPositionsCard } from "./profile/profile-open-positions-card";
import { ProfileProjectsCard } from "./profile/profile-projects-card";
import { ProfileFundingCard } from "./profile/profile-funding-card";
import { ProfileTeachingCard } from "./profile/profile-teaching-card";

interface ProfessorProfileViewProps {
  id?: string;
}

export function ProfessorProfileView({ id }: ProfessorProfileViewProps) {
  const profile = getProfessorProfile(id);
  const [isTracking, setIsTracking] = React.useState(false);

  return (
    <div className="w-full max-w-[960px] mx-auto space-y-6">
      {/* 1. Top Breadcrumb & Action Button matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/universities" className="hover:text-slate-800 transition-colors">
            Universities
          </Link>
          <span>&gt;</span>
          <Link href="/professors" className="hover:text-slate-800 transition-colors">
            Massachusetts Institute of Technology
          </Link>
          <span>&gt;</span>
          <Link href="/professors" className="hover:text-slate-800 transition-colors">
            Professors
          </Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold">{profile.name}</span>
        </nav>

        <button
          type="button"
          onClick={() => setIsTracking(!isTracking)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
            isTracking
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#5D3FD3] text-white hover:bg-[#4E34B5]"
          }`}
        >
          <Bookmark className="h-4 w-4 fill-current" />
          <span>{isTracking ? "Added to Tracking" : "Add to Tracking"}</span>
        </button>
      </div>

      {/* 2. Hero Professor Card matching Figma Screen 06 */}
      <ProfileHeroCard profile={profile} />

      {/* 3. Main Content 2-Column Split: Left Details (632px) + Right Sidebar (304px) */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Left Column (632px) */}
        <div className="w-full lg:w-[632px] flex-1 min-w-0 space-y-6">
          <ProfileAboutCard
            about={profile.about}
            degrees={profile.degrees}
            researchInterests={profile.researchInterests}
          />

          <ProfileExperienceCard experience={profile.experience} />

          <ProfileResearchAreasCard areas={profile.researchAreas} />

          <ProfilePublicationsCard
            publications={profile.publications}
            totalPublications={profile.totalPublications}
          />
        </div>

        {/* Right Column: Contact, External Links, Open Positions (304px) */}
        <aside className="w-full lg:w-[304px] shrink-0 space-y-6">
          <ProfileContactCard contact={profile.contact} />

          <ProfileAtAGlanceCard atAGlance={profile.atAGlance} />

          <ProfileOpenPositionsCard positions={profile.openPositions} />
        </aside>
      </div>

      {/* 4. Full-Width Bottom Sections matching Figma */}
      <div className="w-full space-y-6">
        <ProfileProjectsCard
          projects={profile.projects}
          totalProjects={profile.totalProjects}
        />

        <ProfileFundingCard
          funding={profile.funding}
          totalGrants={profile.totalGrants}
        />

        <ProfileTeachingCard courses={profile.teaching} />
      </div>

      {/* 5. Bottom Navigation & Action Buttons matching Figma */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-200">
        <Link
          href="/professors"
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Professors</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsTracking(!isTracking)}
          className="px-5 py-2.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4E34B5] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Bookmark className="h-4 w-4 fill-current" />
          <span>{isTracking ? "Added to Tracking" : "Add to Tracking"}</span>
        </button>
      </div>
    </div>
  );
}
