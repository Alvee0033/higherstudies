# HigherStudy Platform 🎓

[![Repository](https://img.shields.io/badge/GitHub-Alvee0033%2Fhigherstudies-blue?style=flat&logo=github)](https://github.com/Alvee0033/higherstudies)
[![Visibility](https://img.shields.io/badge/Visibility-Public-brightgreen?style=flat)]()
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-NestJS%2012-ea2845?style=flat&logo=nestjs)](https://nestjs.com/)

A modern, full-stack higher education and study-abroad guidance platform designed to connect prospective graduate and undergraduate scholars with universities, academic mentors, faculty research opportunities, and streamlined application tracking.

🌐 **Public Repository**: [https://github.com/Alvee0033/higherstudies](https://github.com/Alvee0033/higherstudies)

---

## 📁 Repository Directory Structure

```text
higherstudies/
├── README.md                                  # Repository documentation & architecture guide
├── .gitignore                                 # Git ignore rules
│
├── apis/                                      # NestJS 12 Backend API Microservice
│   ├── nest-cli.json                          # Nest CLI configurations
│   ├── package.json                           # Backend dependencies & scripts
│   ├── tsconfig.json                          # TypeScript configuration
│   ├── vitest.config.ts                       # Vitest unit test configuration
│   ├── vitest.config.e2e.ts                   # Vitest E2E test configuration
│   ├── src/
│   │   ├── main.ts                            # Server bootstrap entrypoint & CORS
│   │   ├── app.module.ts                      # Root NestJS application module
│   │   ├── app.controller.ts                  # Health & gateway controllers
│   │   ├── app.controller.spec.ts             # Unit test specs
│   │   └── app.service.ts                     # Business logic services
│   └── test/
│       └── app.e2e-spec.ts                    # End-to-end integration tests
│
└── web/                                       # Next.js 16 (App Router) Frontend
    ├── package.json                           # Frontend scripts & dependencies
    ├── next.config.ts                         # Next.js configuration
    ├── tsconfig.json                          # Strict TypeScript configurations
    ├── eslint.config.mjs                      # ESLint configuration
    │
    ├── public/                                # Public Static Assets
    │   └── images/
    │       ├── avatars/                       # Verified student & professor avatars
    │       │   ├── avatar-arshi.png
    │       │   ├── avatar-nusrat.png
    │       │   ├── avatar-tanvir.png
    │       │   ├── prof-jonathan-smith.png
    │       │   ├── prof-jonathan-smith-list.png
    │       │   └── prof-jonathan-smith-cropped.png
    │       ├── hero/                          # Hero 3D isometric graphics
    │       │   └── hero-illustration.png
    │       ├── landing/                       # Campus photography & review cards
    │       │   ├── campus-hq.png
    │       │   ├── reviews-showcase.png
    │       │   └── services-banner.png
    │       └── services/                      # 3D Services illustration cards
    │           ├── application.jpg
    │           ├── email.jpg
    │           ├── professor.jpg
    │           ├── shortlist.jpg
    │           └── visa.jpg
    │
    └── src/
        ├── app/                               # Next.js App Router Routes
        │   ├── layout.tsx                     # Root document layout & fonts
        │   ├── globals.css                    # Global Tailwind design tokens & themes
        │   │
        │   ├── (auth)/                        # Authentication Route Group
        │   │   ├── layout.tsx                 # Centered auth container
        │   │   └── login/page.tsx             # Login & OAuth modal view
        │   │
        │   ├── (landing)/                     # Public Marketing Route Group
        │   │   ├── layout.tsx                 # Seamless background wrapper & nav
        │   │   └── page.tsx                   # Full landing showcase page
        │   │
        │   └── (dashboard)/                   # Student Portal Route Group
        │       ├── layout.tsx                 # Persistent sidebar & header shell
        │       ├── dashboard/page.tsx         # Student KPI & task overview
        │       ├── universities/page.tsx      # University search & filter directory
        │       ├── professors/                # Faculty Directory
        │       │   ├── page.tsx               # Professor listing & search
        │       │   └── [id]/page.tsx          # Detailed faculty profile & research
        │       ├── applications/              # Application Management
        │       │   ├── page.tsx               # Kanban tracker board (HTML5 DnD)
        │       │   └── [id]/page.tsx          # University application details
        │       ├── email-tracker/page.tsx     # Faculty outreach & email log
        │       ├── ai-tools/page.tsx          # SOP & Email AI generation tools
        │       ├── saved-items/page.tsx       # Shortlisted schools & bookmarks
        │       ├── pricing/page.tsx           # Subscription tiers & checkout
        │       ├── profile/page.tsx           # Academic profile & GPA/IELTS scores
        │       └── settings/page.tsx          # Security & account settings
        │
        ├── components/
        │   ├── layout/                        # Shared Navigation Components
        │   │   ├── dashboard-nav.tsx          # Sidebar menu & user topbar
        │   │   ├── public-navbar.tsx          # Landing page navigation bar
        │   │   └── public-footer.tsx          # Landing page brand footer
        │   │
        │   ├── screens/                       # Screen Implementations
        │   │   ├── auth/                      # Login & social auth forms
        │   │   ├── dashboard/                 # KPI metrics, deadlines, cards
        │   │   ├── landing/                   # Hero, Services, Trust, CTA sections
        │   │   ├── universities/              # Filter panel, university list, badges
        │   │   ├── professors/                # Directory list, profile hero, pubs
        │   │   ├── applications/              # Kanban board, modals, multi-step form
        │   │   ├── email-tracker/             # Outreach table, compose modal, stats
        │   │   ├── ai-tools/                  # Prompt builders & tool cards
        │   │   ├── saved-items/               # Bookmarks & notes list
        │   │   ├── pricing/                   # Pricing table & tier comparisons
        │   │   ├── profile/                   # Academic credentials editor
        │   │   └── settings/                  # User preferences & password forms
        │   │
        │   └── ui/                            # Atomic UI primitives (Badges, Buttons, Cards)
        │
        ├── data/                              # Static content & mock data
        └── lib/                               # Utility helpers, formatters, fonts
```

---

## 🌟 Application Features

- **Marketing & Landing Experience**: Responsive landing page with 3D illustrations, campus photography, trust reviews, and seamless background blending.
- **Student Dashboard**: Real-time application metrics, upcoming deadlines, action item checklists, and recommendation cards.
- **University Explorer**: Granular filters (GPA, IELTS/TOEFL, tuition ranges, regions, R1 status) with real-time match scoring.
- **Professor Directory & Profile**: Research area search, h-index sliders, publication lists, and current openings for PhD/Postdoc candidates.
- **Application Tracker**: Interactive Kanban workflow with drag-and-drop column transitions across Planning, Applied, Interview, Accepted, and Visa stages.
- **Email Outreach Hub**: Faculty communication tracker with status badges (`Sent`, `Positive Reply`, `Interview`, `Follow-up Due`).
- **AI Academic Suite**: Integrated drafting tools for SOPs, faculty cold emails, and CV optimization.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ (v22 LTS recommended)
- **npm**: v10+

### 1. Clone the Repository
```bash
git clone https://github.com/Alvee0033/higherstudies.git
cd higherstudies
```

### 2. Frontend Setup (`web`)
```bash
cd web
npm install
npm run dev        # Starts local dev server at http://localhost:3000
# or
npm run build      # Produces optimized production build
npm run start -- -p 3005
```

### 3. Backend Setup (`apis`)
```bash
cd ../apis
npm install --legacy-peer-deps
npm run start:dev  # Starts NestJS server at http://localhost:4000
npm test           # Runs Vitest unit & integration test suites
```

---

## 🔗 Public Links

- **Repository**: [https://github.com/Alvee0033/higherstudies](https://github.com/Alvee0033/higherstudies)
- **Issues / Bug Reports**: [https://github.com/Alvee0033/higherstudies/issues](https://github.com/Alvee0033/higherstudies/issues)
- **Pull Requests**: [https://github.com/Alvee0033/higherstudies/pulls](https://github.com/Alvee0033/higherstudies/pulls)
