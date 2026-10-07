import * as React from "react";
import { Fingerprint, GraduationCap, FlaskConical, Users2, Globe } from "lucide-react";

interface ProfileAtAGlanceCardProps {
  atAGlance: {
    orcid: string;
    scholarUrl: string;
    researchGateUrl: string;
    linkedInUrl: string;
    twitterHandle: string;
    labWebsite: string;
  };
}

export function ProfileAtAGlanceCard({ atAGlance }: ProfileAtAGlanceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <h3 className="text-base font-bold text-slate-900">At a Glance</h3>
      <div className="space-y-3.5 text-xs">
        {/* ORCID */}
        <div className="flex items-start gap-3">
          <Fingerprint className="h-4 w-4 text-[#787588] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#474556]">ORCID</p>
            <p className="text-sm font-normal text-[#1A1C1E]">{atAGlance.orcid}</p>
          </div>
        </div>

        {/* Google Scholar */}
        <div className="flex items-start gap-3">
          <GraduationCap className="h-4 w-4 text-[#787588] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#474556]">Google Scholar</p>
            <a
              href={atAGlance.scholarUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#440EE8] hover:underline block"
            >
              View Profile
            </a>
          </div>
        </div>

        {/* ResearchGate */}
        <div className="flex items-start gap-3">
          <FlaskConical className="h-4 w-4 text-[#787588] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#474556]">ResearchGate</p>
            <a
              href={atAGlance.researchGateUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#440EE8] hover:underline block"
            >
              View Profile
            </a>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-start gap-3">
          <Users2 className="h-4 w-4 text-[#787588] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#474556]">LinkedIn</p>
            <a
              href={atAGlance.linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#440EE8] hover:underline block"
            >
              View Profile
            </a>
          </div>
        </div>

        {/* Twitter / X */}
        <div className="flex items-start gap-3">
          <svg
            className="h-4 w-4 text-[#787588] shrink-0 mt-0.5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-[#474556]">Twitter / X</p>
            <span className="text-sm text-[#1A1C1E] block">{atAGlance.twitterHandle}</span>
          </div>
        </div>

        {/* Lab Website */}
        <div className="flex items-start gap-3">
          <Globe className="h-4 w-4 text-[#787588] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#474556]">Lab Website</p>
            <a
              href={atAGlance.labWebsite}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#440EE8] hover:underline block truncate"
            >
              {atAGlance.labWebsite}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
