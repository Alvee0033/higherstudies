# AGENTS.md — Engineering Guidelines for HigherStudy

This document serves as the single source of operational guidelines, coding standards, and architectural rules for AI agents and developers working on HigherStudy.

---

## 1. Project Overview & Codebase Architecture

- **Root Directory**: `web/` (Next.js Application)
- **Framework**: Next.js 16.4.0 (Turbopack, App Router, React Server Components)
- **UI & Styling**: React 19.3.0, Tailwind CSS 4.x, Lucide React icons
- **Package Manager**: npm

### Directory Structure & Intent
```
web/
├── public/                     # Static production assets
│   └── images/                 # Active optimized images
│       └── services/           # Bento service card images
├── src/
│   ├── app/                    # Next.js App Router (Segmented by route groups)
│   │   ├── (landing)/          # Public landing page routes (zero URL prefix)
│   │   │   ├── layout.tsx      # Public shell (Navbar, animated Aurora background, Footer)
│   │   │   └── page.tsx        # Landing composition (Hero, Services, Pricing, Trust, Mission)
│   │   ├── (auth)/             # Authentication routes (login, register, forgot-password)
│   │   ├── (dashboard)/        # Authenticated student portal (dashboard, professors, applications)
│   │   ├── layout.tsx          # Root HTML layout (fonts, suppressHydrationWarning, global styles)
│   │   └── globals.css         # Custom tokens, aurora animations, scrollbar styles
│   ├── components/
│   │   ├── screens/            # Screen assemblies (e.g. landing sections)
│   │   ├── layout/             # Shared layout components (public-navbar, public-footer)
│   │   └── ui/                 # Atomic UI primitives (button, badge, card, scroll-reveal)
│   ├── data/                   # Centralized mock and configuration data (landing-content.ts)
│   ├── lib/                    # Shared utilities (cn helper, fonts, formatters)
│   ├── hooks/                  # Custom client React hooks
│   └── types/                  # TypeScript interface definitions
├── PRD.md                      # Complete Product Requirements Document
└── AGENTS.md                   # Agent guidelines & engineering standards
```

---

## 2. Immutable Engineering Rules

### Rule 1: Desktop Layout Invariance
- **NEVER** alter, break, or compromise existing desktop styles (`lg:*`, `xl:*`).
- When introducing responsive mobile adjustments, apply them strictly via mobile breakpoints (`base`, `sm:`, `max-lg:*`).
- Test both 375px–430px mobile viewports and 1440px+ desktop viewports before committing.

### Rule 2: Clean Hydration & React 19 Safety
- Always keep `suppressHydrationWarning` on `<html>` and `<body>` in `src/app/layout.tsx` to prevent third-party browser extensions from creating hydration mismatches.
- Never invoke synchronous state setters inside `useEffect` during mounting without wrapping in `requestAnimationFrame` or proper lifecycle triggers.
- Comply with Next.js 16 Partial Prerendering and React Server Component boundaries: only add `"use client"` where state, effects, or DOM event listeners are required.

### Rule 3: Zero ESLint & TypeScript Errors
- Code must pass `npm run lint` and `npm run build` with **0 errors and 0 warnings**.
- No unused variables or unused imports.
- Proper JSX entity escaping (`&quot;`, `&apos;`).
- Deterministic keys on all `.map()` iterators.

### Rule 4: Data & UI Decoupling
- Never hardcode large strings, pricing arrays, or review lists directly into UI JSX.
- Place all content, package details, and copy inside `src/data/landing-content.ts` (or relevant data module).

### Rule 5: Asset & Resource Cleanliness
- Keep `public/` lean. Do not leave unused uncropped variants, old test files, or unused JSONs.
- Always optimize image loading with `next/image`, proper `sizes`, and drop-shadows.

---

## 3. Screen Specifications (14 Screen Roadmap)

All developers and subagents must reference the Figma screens in `figma_data/screens/`:
1. `01_Landing_Page` → `src/app/(landing)/page.tsx`
2. `02_Login_Form` → `src/app/(auth)/login/page.tsx`
3. `03_Student_Dashboard` → `src/app/(dashboard)/dashboard/page.tsx`
4. `04_Universities_Explorer` → `src/app/(dashboard)/universities/page.tsx`
5. `05_Professor_List` → `src/app/(dashboard)/professors/page.tsx`
6. `06_Professor_Profile` → `src/app/(dashboard)/professors/[id]/page.tsx`
7. `07_AI_Tools` → `src/app/(dashboard)/ai-tools/page.tsx`
8. `08_Student_Profile` → `src/app/(dashboard)/profile/page.tsx`
9. `09_Application_Tracker` → `src/app/(dashboard)/applications/page.tsx`
10. `10_Application_Details` → `src/app/(dashboard)/applications/[id]/page.tsx`
11. `11_Application_Form` → `src/app/(dashboard)/applications/new/page.tsx`
12. `12_Email_Tracker` → `src/app/(dashboard)/email-tracker/page.tsx`
13. `13_Email_Add_Form` → `src/app/(dashboard)/email-tracker/new/page.tsx`
14. `14_Purchase_Plan` → `src/app/(dashboard)/pricing/page.tsx`

---

## 4. Verification Workflow
Before marking any task complete:
1. `npm run lint` → Must exit code 0.
2. `npm run build` → Turbopack must compile and statically generate all routes without errors.
3. Test layout integrity across viewport sizes.
4. Git stage and commit with concise, conventional commit messages.
