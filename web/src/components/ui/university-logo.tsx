'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import compactUniDomains from '@/lib/uni-domains-compact.json';

const uniDomainsRecord = compactUniDomains as Record<string, string>;

export interface UniversityLogoProps {
  name?: string;
  url?: string | null;
  domain?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

const SIZE_MAP: Record<string, { box: string; icon: string }> = {
  xs: { box: 'w-6 h-6 text-[10px] rounded-md', icon: 'w-3 h-3' },
  sm: { box: 'w-8 h-8 text-xs rounded-lg', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10 text-xs rounded-xl', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12 text-sm rounded-xl', icon: 'w-6 h-6' },
  xl: { box: 'w-14 h-14 text-base rounded-2xl', icon: 'w-7 h-7' },
};

const GRADIENTS = [
  'from-indigo-600 to-indigo-800 text-white',
  'from-violet-600 to-purple-800 text-white',
  'from-blue-600 to-cyan-800 text-white',
  'from-rose-600 to-red-800 text-white',
  'from-amber-600 to-orange-800 text-white',
  'from-emerald-600 to-teal-800 text-white',
  'from-slate-700 to-slate-900 text-white',
];

function getInitials(name?: string): string {
  if (!name) return 'U';
  const clean = name.replace(/^(the|university of|college of)\s+/i, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'U';
}

function getGradient(name?: string): string {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function extractDomain(urlOrName?: string | null): string | null {
  if (!urlOrName) return null;
  const str = urlOrName.trim();
  if (str.startsWith('http://') || str.startsWith('https://')) {
    try {
      const parsed = new URL(str);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }
  if (str.includes('.') && !str.includes(' ')) {
    return str.replace(/^www\./, '');
  }
  return null;
}

function lookupDomainByName(name?: string): string | null {
  if (!name) return null;
  const raw = name.toLowerCase().trim();
  if (uniDomainsRecord[raw]) return uniDomainsRecord[raw];

  // Try without parentheses e.g. "The University of Hong Kong (HKU Business School)"
  const cleanParentheses = raw.replace(/\(.*?\)/g, '').trim();
  if (uniDomainsRecord[cleanParentheses]) return uniDomainsRecord[cleanParentheses];

  // Try clean without prefixes
  const clean = cleanParentheses
    .replace(/^(the|university of|college of)\s+/i, '')
    .trim();
  if (uniDomainsRecord[clean]) return uniDomainsRecord[clean];

  // Try prefix before dash or comma
  const base = cleanParentheses.split(/[,–\-]/)[0].trim();
  if (uniDomainsRecord[base]) return uniDomainsRecord[base];

  const baseClean = base.replace(/^(the|university of|college of)\s+/i, '').trim();
  if (uniDomainsRecord[baseClean]) return uniDomainsRecord[baseClean];

  return null;
}

export function UniversityLogo({
  name = 'University',
  url,
  domain: directDomain,
  size = 'md',
  className,
}: UniversityLogoProps) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [triedDdg, setTriedDdg] = React.useState(false);

  const domain = React.useMemo(() => {
    return (
      extractDomain(directDomain) ||
      extractDomain(url) ||
      lookupDomainByName(name)
    );
  }, [directDomain, url, name]);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setImgFailed(false);
      setTriedDdg(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [domain, name]);

  const initials = React.useMemo(() => getInitials(name), [name]);
  const gradient = React.useMemo(() => getGradient(name), [name]);
  const sizeConfig = typeof size === 'string' ? SIZE_MAP[size] || SIZE_MAP.md : null;
  const customStyle: React.CSSProperties = typeof size === 'number'
    ? { width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }
    : {};

  const faviconUrl = domain && !imgFailed
    ? (triedDdg 
        ? `https://icons.duckduckgo.com/ip3/${domain}.ico`
        : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`)
    : null;

  if (faviconUrl) {
    return (
      <div
        style={customStyle}
        className={cn(
          'relative shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/80 bg-white p-1.5 shadow-2xs transition-transform hover:scale-105',
          sizeConfig?.box,
          className
        )}
        title={name}
      >
        <span className={cn('absolute inset-0 flex items-center justify-center font-bold text-xs select-none bg-gradient-to-br', gradient)}>
          {initials}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl}
          alt={`${name} emblem`}
          className="relative z-10 h-full w-full object-contain rounded-md bg-white p-0.5"
          loading="eager"
          decoding="async"
          onError={() => {
            if (!triedDdg) {
              setTriedDdg(true);
            } else {
              setImgFailed(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={customStyle}
      className={cn(
        'relative shrink-0 flex items-center justify-center font-black select-none shadow-2xs bg-gradient-to-br transition-transform hover:scale-105',
        gradient,
        sizeConfig?.box,
        className
      )}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
}
