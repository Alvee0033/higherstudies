# HigherStudy — Architecture, Directory Structure & Roadmap

> Modern Higher Education Advisory & Application Management SaaS platform built with Next.js 16 (Turbopack, App Router) and React 19.

---

## 1. Complete Repository & Directory Structure

```
higher-studies/
├── web/                                # Main Next.js 16 application
│   ├── public/                         # Public static assets
│   │   └── images/                     # Production images & banners
│   │       ├── avatar-arshi.png        # Testimonial avatar 1
│   │       ├── avatar-nusrat.png       # Testimonial avatar 2
│   │       ├── avatar-tanvir.png       # Testimonial avatar 3
│   │       ├── hero-illustration-cropped.png # 3D Hero student graphic
│   │       ├── review.png              # Why Choose Us student graphic
│   │       ├── down-cropped.png        # Services bento banner
│   │       ├── campus-hq.png           # Mission section campus visual
│   │       └── services/               # Bento card service images
│   │           ├── shortlist.jpg       # University shortlisting service
│   │           ├── professor.jpg       # Professor matching service
│   │           ├── email.jpg           # Cold email outreach service
│   │           ├── application.jpg     # Application review service
│   │           └── visa.jpg            # Visa & interview service
│   │
│   ├── src/
│   │   ├── app/                        # Next.js 16 App Router
│   │   │   ├── (landing)/              # Public landing page route group (URL: /)
│   │   │   │   ├── layout.tsx          # Public shell: Navbar + Aurora animated mesh + Footer
│   │   │   │   └── page.tsx            # Main landing page assembling all 5 sections
│   │   │   │
│   │   │   ├── (auth)/                 # Authentication route group (URL: /login, /register)
│   │   │   │   ├── layout.tsx          # Clean auth shell (no landing navbar/footer)
│   │   │   │   ├── login/page.tsx      # Student login & magic link screen
│   │   │   │   └── register/page.tsx   # Student account registration & onboarding
│   │   │   │
│   │   │   ├── (dashboard)/            # Authenticated student portal
│   │   │   │   ├── layout.tsx          # Dashboard shell: Sidebar navigation + Header bar
│   │   │   │   ├── dashboard/page.tsx  # Central student dashboard & KPI overview
│   │   │   │   ├── universities/page.tsx # University explorer & filterable directory
│   │   │   │   ├── professors/         # Professor discovery & matching directory
│   │   │   │   │   ├── page.tsx        # Faculty list with research domain filters
│   │   │   │   │   └── [id]/page.tsx   # Detailed professor lab & contact profile
│   │   │   │   ├── applications/       # Application management pipeline
│   │   │   │   │   ├── page.tsx        # Visual Kanban tracking pipeline
│   │   │   │   │   ├── new/page.tsx    # Add new application entry form
│   │   │   │   │   └── [id]/page.tsx   # Application detail view & document status
│   │   │   │   ├── email-tracker/      # Professor cold email CRM
│   │   │   │   │   ├── page.tsx        # Email status table, follow-up countdowns
│   │   │   │   │   └── new/page.tsx    # Log new email sent modal/page
│   │   │   │   ├── ai-tools/page.tsx   # AI SOP builder, CV critique, supervisor matcher
│   │   │   │   ├── profile/page.tsx    # Academic profile, GPA, test scores, research CV
│   │   │   │   └── pricing/page.tsx    # In-app subscription plan management & checkout
│   │   │   │
│   │   │   ├── layout.tsx              # Root HTML shell (fonts, suppressHydrationWarning)
│   │   │   ├── globals.css             # Tailwind v4 theme, aurora keyframes, base utilities
│   │   │   └── not-found.tsx           # Custom 404 page
│   │   │
│   │   ├── components/                 # Reusable React components
│   │   │   ├── screens/                # Full screen/section implementations
│   │   │   │   └── landing/            # Landing page sections:
│   │   │   │       ├── hero-section.tsx        # Hero banner with headlines and CTAs
│   │   │   │       ├── hero-graphic.tsx        # Hero 3D floating visual and stat cards
│   │   │   │       ├── services-section.tsx    # Bento-grid 5 advisory pillars
│   │   │   │       ├── animated-service-icons.tsx # Custom micro-animated SVG icons
│   │   │   │       ├── pricing-section.tsx     # Seasonal/Annual pricing with swipe carousel
│   │   │   │       ├── trust-reviews-section.tsx # Why Choose Us + student review wall
│   │   │   │       └── mission-cta-section.tsx # Mission banner, FAQ accordion & final CTA
│   │   │   │
│   │   │   ├── layout/                 # Site shell components
│   │   │   │   ├── public-navbar.tsx   # Glassmorphic header navigation bar
│   │   │   │   └── public-footer.tsx   # Global footer with link columns
│   │   │   │
│   │   │   ├── ui/                     # Atomic UI primitives
│   │   │   │   ├── button.tsx          # Button component with variants
│   │   │   │   ├── badge.tsx           # Pill badges and indicator chips
│   │   │   │   ├── card.tsx            # Card containers
│   │   │   │   └── scroll-reveal.tsx   # IntersectionObserver scroll entrance animations
│   │   │   │
│   │   │   └── feedback/               # Modals, toasts, empty states, skeletons
│   │   │
│   │   ├── data/                       # Centralized data definitions & content copy
│   │   │   └── landing-content.ts      # Single source of truth for packages, features, reviews
│   │   │
│   │   ├── lib/                        # Utilities & helpers
│   │   │   ├── utils.ts                # Tailwind clsx + twMerge utility (`cn`)
│   │   │   ├── fonts.ts                # Next font definitions
│   │   │   └── formatters.ts           # Currency and date formatting helpers
│   │   │
│   │   ├── hooks/                      # Custom React hooks (media queries, scroll watchers)
│   │   └── types/                      # TypeScript type declarations & models
│   │
│   ├── package.json                    # Dependencies & build scripts
│   ├── next.config.ts                  # Next.js 16 configuration
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   ├── eslint.config.mjs               # ESLint 9 configuration
│   ├── PRD.md                          # Full Product Requirements Document
│   └── AGENTS.md                       # AI Agent rules & developer standards
│
└── figma_data/                         # Figma design assets & source references
    ├── file_data.json                  # Complete Figma node tree dump
    └── screens/                        # 14 high-fidelity screen mockups from Figma
        ├── 01_Landing_Page.png
        ├── 02_Login_Form.png
        ├── 03_Student_Dashboard.png
        ├── 04_Universities_Explorer.png
        ├── 05_Professor_List.png
        ├── 06_Professor_Profile.png
        ├── 07_AI_Tools.png
        ├── 08_Student_Profile.png
        ├── 09_Application_Tracker.png
        ├── 10_Application_Details.png
        ├── 11_Application_Form.png
        ├── 12_Email_Tracker.png
        ├── 13_Email_Add_Form.png
        └── 14_Purchase_Plan.png
```

---

## 2. The 14 Core Screens Mapping

| Screen Number | Screen Name | Route Path | Implementation Status |
|:---:|:---|:---|:---:|
| **01** | Landing Page | `src/app/(landing)/page.tsx` |  **Completed** (Fully responsive, animations, 0 errors) |
| **02** | Login Form | `src/app/(auth)/login/page.tsx` | ⏳ Ready for implementation |
| **03** | Student Dashboard | `src/app/(dashboard)/dashboard/page.tsx` | ⏳ Ready for implementation |
| **04** | Universities Explorer | `src/app/(dashboard)/universities/page.tsx` | ⏳ Ready for implementation |
| **05** | Professor List | `src/app/(dashboard)/professors/page.tsx` | ⏳ Ready for implementation |
| **06** | Professor Profile | `src/app/(dashboard)/professors/[id]/page.tsx` | ⏳ Ready for implementation |
| **07** | AI Tools | `src/app/(dashboard)/ai-tools/page.tsx` | ⏳ Ready for implementation |
| **08** | Student Profile | `src/app/(dashboard)/profile/page.tsx` | ⏳ Ready for implementation |
| **09** | Application Tracker | `src/app/(dashboard)/applications/page.tsx` | ⏳ Ready for implementation |
| **10** | Application Details | `src/app/(dashboard)/applications/[id]/page.tsx` | ⏳ Ready for implementation |
| **11** | Application Form | `src/app/(dashboard)/applications/new/page.tsx` | ⏳ Ready for implementation |
| **12** | Email Tracker | `src/app/(dashboard)/email-tracker/page.tsx` | ⏳ Ready for implementation |
| **13** | Email Add Form | `src/app/(dashboard)/email-tracker/new/page.tsx` | ⏳ Ready for implementation |
| **14** | Purchase Plan | `src/app/(dashboard)/pricing/page.tsx` | ⏳ Ready for implementation |

---

## 3. Tech Stack & Engineering Standards

- **Next.js 16.4.0** with Turbopack & App Router
- **React 19.3.0** with strict Server Component boundaries
- **Tailwind CSS 4.x** with custom design tokens
- **TypeScript 5.x** with 100% strict type safety
- **ESLint 9** with zero warnings or errors policy
- **Desktop Invariance**: Zero modifications allowed to desktop layouts (`lg:*`, `xl:*`) when doing mobile optimization.
