# Product Requirements Document (PRD) — HigherStudy

## 1. Executive Summary & Product Vision
**HigherStudy** is an all-in-one higher education advisory and application management SaaS platform built to empower ambitious international students to secure university admissions, research supervisor matches, and fully funded scholarships (PhD, Master's, and Undergraduate).

The platform eliminates the stress of global admissions by unifying:
1. **Curated Global Discovery**: University, program, and professor exploration with research compatibility metrics.
2. **Outreach & Communication CRM**: Cold emailing tracker with response logging, follow-up alerts, and email templates.
3. **Application & Visa Pipeline**: Multi-stage visual Kanban pipeline for applications, document checklists, and visa interview workflows.
4. **AI-Powered Tools**: Statement of Purpose (SOP) guidance, CV optimization, and supervisor matching.
5. **Subscription & Advisory Tiers**: Flexible seasonal/annual pricing tiers with expert advisory consultations.

---

## 2. Core Personas
1. **Prospective Graduate Student (Primary)**:
   - Needs: Finding funded professors in specific STEM/Humanities domains, sending structured emails, and tracking deadlines across 15+ universities.
2. **Undergraduate & Scholarship Hunter**:
   - Needs: Finding universities offering full-ride scholarships, meeting minimum GPA/language prerequisites, and preparing visa files.
3. **Education Counselor / Reviewer (Secondary)**:
   - Needs: Reviewing student drafts, SOPs, and interview readiness.

---

## 3. Product Scope & The 14 Core Screens Architecture
Derived from the Figma system specification (`figma_data/screens`):

| # | Screen ID | Module / Route | Purpose & Key Features |
|---|---|---|---|
| **01** | `01_Landing_Page` | `/(landing)` | Responsive marketing landing page with continuous Aurora gradients, 5 bento services, pricing carousel, why-choose-us graphic, and student reviews. |
| **02** | `02_Login_Form` | `/(auth)/login` | Secure student login, magic link, passwordless authentication, social auth, and session handling. |
| **03** | `03_Student_Dashboard` | `/(dashboard)/dashboard` | Central command center: active application counters, email response rate, upcoming deadlines calendar, and recommended professors. |
| **04** | `04_Universities_Explorer` | `/(dashboard)/universities` | Global university search, filter by country, QS ranking, tuition waiver availability, and program intakes (Fall/Spring). |
| **05** | `05_Professor_List` | `/(dashboard)/professors` | Faculty search directory filtered by research domain, acceptance history, university, and funding status. |
| **06** | `06_Professor_Profile` | `/(dashboard)/professors/[id]` | Deep professor profile: lab details, recent publications, active funding grants, direct email button, and past student placements. |
| **07** | `07_AI_Tools` | `/(dashboard)/ai-tools` | AI SOP generator & critique, cold email personalization assistant, and professor research match analyzer. |
| **08** | `08_Student_Profile` | `/(dashboard)/profile` | Academic records (GPA, GRE/IELTS scores), target degree levels, publication records, and CV upload. |
| **09** | `09_Application_Tracker` | `/(dashboard)/applications` | Kanban board / list view of admission applications across stages (Drafting, Submitted, Under Review, Accepted, Waitlisted). |
| **10** | `10_Application_Details` | `/(dashboard)/applications/[id]` | Deep dive into an individual university application: fee receipts, portal login credentials, interview notes, and status timestamps. |
| **11** | `11_Application_Form` | `/(dashboard)/applications/new` | Multi-step form to register a new target application with requirements checklist and deadline reminders. |
| **12** | `12_Email_Tracker` | `/(dashboard)/email-tracker` | Professor communication tracker: Sent date, follow-up countdown, response received, positive/negative response tagging. |
| **13** | `13_Email_Add_Form` | `/(dashboard)/email-tracker/new` | Modal/form to log a new professor outreach email with template selector and attachment tracker. |
| **14** | `14_Purchase_Plan` | `/(dashboard)/pricing` or `/(dashboard)/upgrade` | In-app plan upgrade / payment checkout: Free, Starter, Pro, and Premium tiers with BDT currency support and feature matrix. |

---

## 4. Technical Architecture & Stack
- **Framework**: **Next.js 16.4.0** (App Router, Turbopack, React Server Components).
- **Runtime / Language**: **React 19.3.0**, **TypeScript 5.x**.
- **Styling**: **Tailwind CSS 4.x**, Lucide React icons, custom Aurora keyframe system, CSS blend modes.
- **State Management & Data Fetching**: Server Components for static/read-only data, lightweight React state & hooks for client interactions.
- **Quality & Linting**: ESLint 9 (`eslint-config-next`), strict TypeScript checking, zero hydration mismatch protocols (`suppressHydrationWarning`).

---

## 5. Non-Functional Requirements & Design Principles
1. **Desktop / Mobile Isolation**: Desktop layout (`lg:*`, `xl:*`) must remain pixel-faithful to design specifications. Mobile layout uses horizontal touch carousels, responsive flex columns, and touch-optimized buttons.
2. **Performance**: Under 1s LCP, zero layout shifts (CLS < 0.05), fully static pre-rendered marketing pages (`next build` static export ready).
3. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigability, semantic tags, and graceful fallback for `prefers-reduced-motion`.
4. **Data Isolation**: Centralized mock content in `src/data/` allowing seamless migration to database APIs (PostgreSQL / Supabase / Prisma).
