# HigherStudy Platform

A full-stack higher education and study-abroad guidance platform designed to connect prospective graduate and undergraduate scholars with universities, academic mentors, faculty research opportunities, and application tracking workflows.

---

## Repository Directory Structure

```text
higherstudies/
├── README.md                                  # Repository documentation and architecture guide
├── .gitignore                                 # Git ignore rules
│
├── apis/                                      # NestJS Backend API Service
│   ├── nest-cli.json                          # Nest CLI configurations
│   ├── package.json                           # Backend dependencies and scripts
│   ├── tsconfig.json                          # TypeScript configuration
│   ├── vitest.config.ts                       # Vitest unit test configuration
│   ├── vitest.config.e2e.ts                   # Vitest E2E test configuration
│   ├── src/
│   │   ├── main.ts                            # Server bootstrap entrypoint and CORS
│   │   ├── app.module.ts                      # Root NestJS application module
│   │   ├── app.controller.ts                  # Gateway controller
│   │   ├── app.controller.spec.ts             # Unit test suite
│   │   └── app.service.ts                     # Application service layer
│   └── test/
│       └── app.e2e-spec.ts                    # End-to-end integration tests
│
└── web/                                       # Next.js Frontend Application
    ├── package.json                           # Frontend scripts and dependencies
    ├── next.config.ts                         # Next.js configuration
    ├── tsconfig.json                          # TypeScript configuration
    ├── eslint.config.mjs                      # ESLint configuration
    │
    ├── public/                                # Public Static Assets
    │   └── images/
    │       ├── avatars/                       # Student and faculty portraits
    │       │   ├── avatar-arshi.png
    │       │   ├── avatar-nusrat.png
    │       │   ├── avatar-tanvir.png
    │       │   ├── prof-jonathan-smith.png
    │       │   ├── prof-jonathan-smith-list.png
    │       │   └── prof-jonathan-smith-cropped.png
    │       ├── hero/                          # Hero isometric assets
    │       │   └── hero-illustration.png
    │       ├── landing/                       # Campus and showcase assets
    │       │   ├── campus-hq.png
    │       │   ├── reviews-showcase.png
    │       └── services/                      # Service illustration cards
    │           ├── application.jpg
    │           ├── email.jpg
    │           ├── professor.jpg
    │           ├── shortlist.jpg
    │           └── visa.jpg
    │
    └── src/
        ├── app/                               # Next.js App Router
        │   ├── layout.tsx                     # Root document layout
        │   ├── globals.css                    # Tailwind CSS configuration
        │   │
        │   ├── (auth)/                        # Authentication Route Group
        │   │   ├── layout.tsx                 # Centered auth wrapper
        │   │   └── login/page.tsx             # Login view
        │   │
        │   ├── (landing)/                     # Landing Route Group
        │   │   ├── layout.tsx                 # Landing layout wrapper
        │   │   └── page.tsx                   # Landing page view
        │   │
        │   └── (dashboard)/                   # Student Portal Route Group
        │       ├── layout.tsx                 # Dashboard navigation wrapper
        │       ├── dashboard/page.tsx         # Dashboard overview
        │       ├── universities/page.tsx      # University explorer
        │       ├── professors/                # Professor Directory
        │       │   ├── page.tsx               # Professor listing
        │       │   └── [id]/page.tsx          # Professor profile
        │       ├── applications/              # Application Management
        │       │   ├── page.tsx               # Kanban application tracker
        │       │   └── [id]/page.tsx          # Application details
        │       ├── email-tracker/page.tsx     # Faculty email tracker
        │       ├── ai-tools/page.tsx          # Academic AI tools
        │       ├── saved-items/page.tsx       # Shortlisted items
        │       ├── pricing/page.tsx           # Subscription tiers
        │       ├── profile/page.tsx           # Student academic profile
        │       └── settings/page.tsx          # Account settings
        │
        ├── components/
        │   ├── layout/                        # Navigation Components
        │   │   ├── dashboard-nav.tsx          # Sidebar and top navigation bar
        │   │   ├── public-navbar.tsx          # Public navbar
        │   │   └── public-footer.tsx          # Public footer
        │   │
        │   ├── screens/                       # High-Cohesion, Modular Screen Implementations
        │   │   ├── dashboard/                 # Student dashboard modular widgets
        │   │   │   ├── components/            # KPI grid, reminders card, donut chart, recent emails
        │   │   │   ├── dashboard-data.ts      # Isolated mock data
        │   │   │   ├── dashboard-types.ts     # TypeScript interfaces
        │   │   │   └── student-dashboard-view.tsx
        │   │   ├── universities/              # University explorer and facet search
        │   │   │   ├── components/            # Filter sidebar, university card, results header, pagination
        │   │   │   ├── university-data.ts     # Database of universities & programs
        │   │   │   ├── university-types.ts    # Filter & institution models
        │   │   │   └── universities-explorer-view.tsx
        │   │   ├── professors/                # Professor directory & profiles
        │   │   │   ├── components/            # Institution header, search controls, professor card, filters
        │   │   │   ├── profile/               # Modular profile cards (hero, publications, research, etc.)
        │   │   │   ├── professor-data.ts      # Faculty database
        │   │   │   ├── professor-types.ts     # Faculty models
        │   │   │   ├── professor-list-view.tsx
        │   │   │   └── professor-profile-view.tsx
        │   │   ├── applications/              # Application pipeline CRM
        │   │   │   ├── form/                  # Multi-step application submission components
        │   │   │   ├── application-kanban-board.tsx
        │   │   │   ├── application-metrics.tsx
        │   │   │   ├── application-details-view.tsx
        │   │   │   └── application-tracker-view.tsx
        │   │   ├── email-tracker/             # Faculty cold email tracker
        │   │   │   ├── email-tracker-table.tsx
        │   │   │   ├── email-tracker-metrics.tsx
        │   │   │   ├── email-add-modal.tsx
        │   │   │   └── email-tracker-view.tsx
        │   │   ├── landing/                   # Landing page sections (hero, services bento, pricing, reviews, CTA)
        │   │   ├── auth/                      # Student authentication form & validation
        │   │   ├── ai-tools/                  # Academic AI tools suite
        │   │   ├── saved-items/               # Shortlisted programs & mentors
        │   │   ├── pricing/                   # In-app subscription plan management
        │   │   ├── profile/                   # Student academic profile editor
        │   │   └── settings/                  # User preference forms
        │   │
        │   └── ui/                            # Atomic UI Design System Primitives
        │       ├── card.tsx                   # Compound Card system (Header, Title, Content, Footer)
        │       ├── button.tsx                 # Button design tokens (brand, brand-outline, sizes)
        │       ├── stat-card.tsx              # Standalone KPI metric card primitive
        │       ├── badge.tsx                  # Status badges and indicators
        │       └── scroll-reveal.tsx          # IntersectionObserver animations
        │
        ├── data/                              # Static content and mock data
        └── lib/                               # Utilities and helper functions
```

---

## Core Capabilities

- **Landing and Marketing**: Responsive presentation covering core services, verified reviews, and academic advising offerings.
- **Student Dashboard**: Application status overview, upcoming deadlines, and profile progress tracking.
- **University Explorer**: Searchable database with filtering by degree level, study destinations, GPA, and language proficiency requirements.
- **Professor Directory**: Faculty profiles indexing research areas, citation statistics, publications, and open graduate opportunities.
- **Application Tracker**: Multi-column Kanban board managing pipeline stages from planning through visa submission.
- **Email Outreach Hub**: Centralized log for recording and tracking correspondence with prospective academic advisors.
- **Academic AI Suite**: Workflow assistance for statement drafting and correspondence templates.

---

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Frontend Setup

```bash
cd web
npm install
npm run dev
```

For production builds:
```bash
npm run build
npm run start -- -p 3005
```

### Backend Setup

```bash
cd apis
npm install --legacy-peer-deps
npm run start:dev
```

To run backend tests:
```bash
npm test
```
