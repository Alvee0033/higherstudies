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
│   │   │   ├── ui/                     # Design System Primitives
│   │   │   │   ├── card.tsx            # Compound Card (CardHeader, CardTitle, CardContent, CardFooter)
│   │   │   │   ├── button.tsx          # Design token variants (brand, brand-outline, rounded options)
│   │   │   │   ├── stat-card.tsx       # Reusable KPI StatCard primitive
│   │   │   │   ├── badge.tsx           # Pill badges and indicator chips
│   │   │   │   └── scroll-reveal.tsx   # IntersectionObserver scroll entrance animations
│   │   │   │
│   │   │   ├── layout/                 # Site shell navigation components
│   │   │   │   ├── dashboard-nav.tsx   # Sidebar navigation and header
│   │   │   │   ├── public-navbar.tsx   # Glassmorphic header navigation bar
│   │   │   │   └── public-footer.tsx   # Global footer with link columns
│   │   │   │
│   │   │   └── screens/                # Modular Screen Implementations (High Cohesion, Low Coupling)
│   │   │       ├── dashboard/          # Student Dashboard (components/, types, data, coordinator)
│   │   │       ├── universities/       # Universities Explorer (components/, types, data, coordinator)
│   │   │       ├── professors/         # Professor Directory & Profiles (components/, profile/, types, data)
│   │   │       ├── applications/       # Application Pipeline Tracker (form/, kanban, metrics, modals)
│   │   │       ├── email-tracker/      # Outreach Email CRM (table, metrics, modals, types, data)
│   │   │       ├── landing/            # Landing page modular sections (hero, services, pricing, reviews, CTA)
│   │   │       ├── auth/               # Student authentication form
│   │   │       ├── ai-tools/           # AI academic tools view
│   │   │       ├── profile/            # Student academic profile view
│   │   │       ├── saved-items/        # Shortlist programs & faculty view
│   │   │       ├── pricing/            # In-app pricing & tier checkout view
│   │   │       └── settings/           # Account settings view
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

| Screen Number | Screen Name | Route Path | Architecture & Implementation Status |
|:---:|:---|:---|:---:|
| **01** | Landing Page | `src/app/(landing)/page.tsx` | Completed (Modular sections: hero, services bento, pricing, reviews, mission) |
| **02** | Login Form | `src/app/(auth)/login/page.tsx` | Completed (Modular auth form, social OAuth, input validation) |
| **03** | Student Dashboard | `src/app/(dashboard)/dashboard/page.tsx` | Completed (Modular KPI grid, reminders card, donut chart, recent emails) |
| **04** | Universities Explorer | `src/app/(dashboard)/universities/page.tsx` | Completed (Modular filter sidebar, university cards, results header, pagination) |
| **05** | Professor List | `src/app/(dashboard)/professors/page.tsx` | Completed (Modular faculty header, search controls, professor cards, filters) |
| **06** | Professor Profile | `src/app/(dashboard)/professors/[id]/page.tsx` | Completed (Modular lab metrics, contact details, publication cards) |
| **07** | AI Tools | `src/app/(dashboard)/ai-tools/page.tsx` | Completed (Modular SOP generator, CV reviewer, cold email drafter) |
| **08** | Student Profile | `src/app/(dashboard)/profile/page.tsx` | Completed (Modular profile header, academic history, test scores, research tabs) |
| **09** | Application Tracker | `src/app/(dashboard)/applications/page.tsx` | Completed (Modular metrics header, drag-and-drop Kanban board, modals) |
| **10** | Application Details | `src/app/(dashboard)/applications/[id]/page.tsx` | Completed (Modular timeline, document checklist, requirements tracker) |
| **11** | Application Form | `src/app/(dashboard)/applications/new/page.tsx` | Completed (Modular multi-step application submission modal & view) |
| **12** | Email Tracker | `src/app/(dashboard)/email-tracker/page.tsx` | Completed (Modular outreach metrics, filterable status table, actions) |
| **13** | Email Add Form | `src/app/(dashboard)/email-tracker/new/page.tsx` | Completed (Modular cold email logger modal and composer) |
| **14** | Purchase Plan | `src/app/(dashboard)/pricing/page.tsx` | Completed (Modular billing tier selector, feature comparison matrix) |

---

## 3. Tech Stack & Engineering Standards

- **Next.js 16.4.0** with Turbopack & App Router
- **React 19.3.0** with strict Server Component boundaries
- **Tailwind CSS 4.x** with custom design tokens
- **TypeScript 5.x** with 100% strict type safety
- **ESLint 9** with zero warnings or errors policy
- **Desktop Invariance**: Zero modifications allowed to desktop layouts (`lg:*`, `xl:*`) when doing mobile optimization.
