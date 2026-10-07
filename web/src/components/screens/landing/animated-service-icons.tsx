import * as React from "react";

interface IconProps {
  className?: string;
}

export function UniversityShortlistingIcon({ className }: IconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className || "h-16 w-16"}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-md group-hover:bg-indigo-500/25 transition-all duration-500" />
      
      {/* Icon Frame */}
      <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 border border-indigo-100 flex items-center justify-center p-3 shadow-sm group-hover:border-indigo-300 group-hover:shadow-[0_8px_20px_rgba(79,70,229,0.18)] transition-all duration-300">
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
          {/* Subtle Background Orbit Ring */}
          <circle
            cx="24"
            cy="24"
            r="19"
            stroke="#C7D2FE"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="opacity-40 group-hover:opacity-80 transition-opacity"
          />

          {/* Floating Top Sparkle */}
          <path
            d="M36 10L37 13L40 14L37 15L36 18L35 15L32 14L35 13L36 10Z"
            fill="#818CF8"
            className="animate-pulse"
          />

          {/* Graduation Cap Base (Underlay) */}
          <path
            d="M13 25.5V31C13 34.5 18 36.5 24 36.5C30 36.5 35 34.5 35 31V25.5"
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#EEF2FF"
          />

          {/* Graduation Cap Diamond (Upper Mortarboard) */}
          <polygon
            points="24,13 41,20 24,27 7,20"
            fill="url(#cap-gradient)"
            stroke="#4F46E5"
            strokeWidth="2"
            className="group-hover:-translate-y-1 transition-transform duration-300"
          />

          {/* Center Cap Button */}
          <circle cx="24" cy="20" r="2" fill="#312E81" />

          {/* Swaying Tassel */}
          <g className="animate-sway-tassel">
            <path
              d="M24 20C24 20 28 22 28.5 27"
              stroke="#F59E0B"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle cx="28.5" cy="28.5" r="2" fill="#D97706" />
            <path
              d="M27.5 30.5L29.5 30.5M28 32.5L29 32.5"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          <defs>
            <linearGradient id="cap-gradient" x1="7" y1="13" x2="41" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function ProfessorResearchIcon({ className }: IconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className || "h-16 w-16"}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-sky-500/10 blur-md group-hover:bg-sky-500/25 transition-all duration-500" />
      
      {/* Icon Frame */}
      <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border border-sky-100 flex items-center justify-center p-3 shadow-sm group-hover:border-sky-300 group-hover:shadow-[0_8px_20px_rgba(2,132,199,0.18)] transition-all duration-300">
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
          {/* Radar Scanner Sweep (Spinning) */}
          <g className="animate-radar-spin opacity-30 group-hover:opacity-75 transition-opacity" style={{ transformOrigin: "21px 21px" }}>
            <circle cx="21" cy="21" r="14" stroke="#0284C7" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="21" y1="21" x2="35" y2="21" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Research Target Dots */}
          <circle cx="21" cy="14" r="1.5" fill="#0284C7" className="animate-ping" style={{ animationDuration: "2s" }} />
          <circle cx="27" cy="25" r="1.5" fill="#38BDF8" />

          {/* Magnifying Glass Body */}
          <circle
            cx="21"
            cy="21"
            r="11"
            fill="url(#lens-gradient)"
            stroke="#0284C7"
            strokeWidth="2.5"
            className="group-hover:scale-105 transition-transform duration-300"
            style={{ transformOrigin: "21px 21px" }}
          />

          {/* Lens Glass Glint */}
          <path
            d="M15 17C16.5 15 19 14 22 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Central Target / Professor Node */}
          <circle cx="21" cy="21" r="3.5" fill="#0369A1" />
          <circle cx="21" cy="21" r="1.5" fill="white" />

          {/* Handle */}
          <path
            d="M29.5 29.5L39 39"
            stroke="#0369A1"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"
          />
          <path
            d="M33 33L38 38"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="lens-gradient" x1="10" y1="10" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="1" stopColor="#BAE6FD" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function EmailTrackerIcon({ className }: IconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className || "h-16 w-16"}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-md group-hover:bg-purple-500/25 transition-all duration-500" />
      
      {/* Icon Frame */}
      <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-purple-50 via-white to-fuchsia-50/50 border border-purple-100 flex items-center justify-center p-3 shadow-sm group-hover:border-purple-300 group-hover:shadow-[0_8px_20px_rgba(147,51,234,0.18)] transition-all duration-300">
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
          {/* Signal wave dots */}
          <circle cx="9" cy="15" r="1" fill="#C084FC" className="animate-ping" style={{ animationDuration: "2.5s" }} />

          {/* Rising Letter (Animated) */}
          <g className="animate-mail-rise">
            <rect
              x="14"
              y="11"
              width="20"
              height="16"
              rx="2.5"
              fill="white"
              stroke="#D8B4FE"
              strokeWidth="1.5"
            />
            {/* Letter content lines */}
            <line x1="18" y1="16" x2="30" y2="16" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="20" x2="26" y2="20" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Envelope Base Body */}
          <rect
            x="8"
            y="17"
            width="32"
            height="22"
            rx="4"
            fill="url(#env-gradient)"
            stroke="#9333EA"
            strokeWidth="2"
          />

          {/* Envelope Fold Lines */}
          <path
            d="M8.5 18L24 29L39.5 18"
            stroke="#9333EA"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 38.5L19 28"
            stroke="#A855F7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M39.5 38.5L29 28"
            stroke="#A855F7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Notification Ping Badge (Top Right) */}
          <circle cx="36" cy="14" r="5" fill="#EF4444" stroke="white" strokeWidth="1.5" />
          <circle cx="36" cy="14" r="2" fill="white" />

          <defs>
            <linearGradient id="env-gradient" x1="8" y1="17" x2="40" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAF5FF" />
              <stop offset="1" stopColor="#F3E8FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function ApplicationTrackerIcon({ className }: IconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className || "h-16 w-16"}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-md group-hover:bg-amber-500/25 transition-all duration-500" />
      
      {/* Icon Frame */}
      <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50/50 border border-amber-100 flex items-center justify-center p-3 shadow-sm group-hover:border-amber-300 group-hover:shadow-[0_8px_20px_rgba(217,119,6,0.18)] transition-all duration-300">
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
          {/* Clipboard Board */}
          <rect
            x="11"
            y="11"
            width="26"
            height="31"
            rx="4"
            fill="url(#clip-gradient)"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Clipboard Top Metallic Clamp */}
          <rect x="18" y="7" width="12" height="6" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="24" cy="10" r="1.5" fill="#78350F" />

          {/* Checklist Item 1 with Green Checkmark */}
          <rect x="15" y="17" width="4" height="4" rx="1" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
          <path d="M16 19L17 20L19.5 17.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="22" y1="19" x2="32" y2="19" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

          {/* Checklist Item 2 with Green Checkmark */}
          <rect x="15" y="24" width="4" height="4" rx="1" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
          <path d="M16 26L17 27L19.5 24.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="22" y1="26" x2="30" y2="26" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

          {/* Checklist Item 3 (In Progress) */}
          <rect x="15" y="31" width="4" height="4" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <line x1="22" y1="33" x2="28" y2="33" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

          {/* Dynamic Progress Fill Bar */}
          <rect x="15" y="38" width="18" height="2" rx="1" fill="#FDE68A" />
          <rect
            x="15"
            y="38"
            width="13"
            height="2"
            rx="1"
            fill="#D97706"
            className="group-hover:w-[18px] transition-all duration-500"
          />

          {/* Floating Gold Star Badge */}
          <g className="group-hover:scale-110 transition-transform duration-300" style={{ transformOrigin: "35px 33px" }}>
            <circle cx="35" cy="33" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <path
              d="M35 30.5L35.8 32.2L37.7 32.4L36.3 33.7L36.7 35.5L35 34.6L33.3 35.5L33.7 33.7L32.3 32.4L34.2 32.2Z"
              fill="white"
            />
          </g>

          <defs>
            <linearGradient id="clip-gradient" x1="11" y1="11" x2="37" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFBEB" />
              <stop offset="1" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function VisaSupportIcon({ className }: IconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className || "h-16 w-16"}`}>
      {/* Ambient Pulsing Aura */}
      <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-md group-hover:bg-violet-500/25 transition-all duration-500" />
      
      {/* Icon Frame */}
      <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-violet-50 via-white to-indigo-50/50 border border-violet-100 flex items-center justify-center p-3 shadow-sm group-hover:border-violet-300 group-hover:shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition-all duration-300">
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
          {/* Animated Flight Path (Dotted) */}
          <path
            d="M9 36C12 28 20 20 34 16"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-flight-dash opacity-70"
          />

          {/* Passport / Stamp Tile in Background */}
          <rect
            x="8"
            y="22"
            width="16"
            height="20"
            rx="3"
            fill="#EDE9FE"
            stroke="#7C3AED"
            strokeWidth="1.5"
            transform="rotate(-8 8 22)"
          />
          <circle cx="16" cy="30" r="4" stroke="#A78BFA" strokeWidth="1" strokeDasharray="1.5 1.5" />

          {/* Supersonic Jet Plane (Animated Glide on Group Hover) */}
          <g className="group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out">
            {/* Plane Silhouette */}
            <path
              d="M38 12L28 17L19 16L17 18L24 21L21 26L17 26L16 28L21 29L24 34L26 33L26 29L31 26L33 17L38 12Z"
              fill="url(#jet-gradient)"
              stroke="#6D28D9"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Plane Wing accent */}
            <path d="M26 21L33 17" stroke="white" strokeWidth="1" opacity="0.8" />
          </g>

          {/* Twinkling Departure Star */}
          <path
            d="M40 7L40.8 9.2L43 10L40.8 10.8L40 13L39.2 10.8L37 10L39.2 9.2Z"
            fill="#F59E0B"
            className="animate-pulse"
          />

          <defs>
            <linearGradient id="jet-gradient" x1="16" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export const ANIMATED_ICONS_MAP = {
  shortlisting: UniversityShortlistingIcon,
  professors: ProfessorResearchIcon,
  "email-tracker": EmailTrackerIcon,
  "application-tracker": ApplicationTrackerIcon,
  "visa-support": VisaSupportIcon,
};
