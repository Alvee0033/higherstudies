import * as React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Send } from "lucide-react";

interface ProfileContactCardProps {
  contact: {
    email: string;
    phone: string;
    office: string;
    website: string;
    lastEmailSent: string;
    lastReplied: string;
  };
}

export function ProfileContactCard({ contact }: ProfileContactCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0F172A]">Contact Professor</h3>
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <a href={contact.email?`mailto:${contact.email}`:undefined} className="text-[#1476F2] hover:underline">
            {contact.email||"Public email not collected"}
          </a>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-slate-700">{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-slate-700">{contact.office}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Globe className="h-4 w-4 text-slate-400 shrink-0" />
          <a
            href={contact.website||undefined}
            target="_blank"
            rel="noreferrer"
            className="text-[#1476F2] hover:underline truncate"
          >
            {contact.website||"Official profile not collected"}
          </a>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <p className="text-slate-500">Last email sent: {contact.lastEmailSent}</p>
        <p className="text-[#16A34A] font-medium">Replied on {contact.lastReplied}</p>
      </div>

      <Link
        href="/email-tracker?add=true"
        className="w-full py-2.5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
      >
        <Send className="h-4 w-4" />
        <span>Track outreach</span>
      </Link>
    </div>
  );
}
