# Admin app design specification

**Status:** the separate `admin/` Next.js MVP is implemented. This document also specifies later screens and workflows that remain planned. The admin app is an editorial control room, not a copy of the student dashboard. Its current visual language uses navy text, one blue action color, white surfaces, and restrained semantic status colors.

## Shell and navigation

Desktop: persistent left navigation, compact top bar with environment, global search, job health, account menu and role. Mobile: accessible drawer and full-width content. Sections: Overview; Catalogue (Institutions, Programmes, Requirements, Funding, Faculty); Review; Sources; Jobs; Audit; Staff (admin only). The admin-only Audit log shows paginated staff/system events. Breadcrumbs link back to filtered lists. Saved filters appear in the URL. Tables collapse to readable cards or horizontal scroll with visible key actions at narrow widths.

## Screens

| Screen | Main information and actions |
| --- | --- |
| Overview | Verified/discovered counts, missing requirement coverage, stale records, review backlog, source failures, recent job activity; country/institution drill-down. |
| Institutions | Search/filter by country and verification; profile with identifiers, official domains, programmes, faculty, source coverage and merge history. |
| Programmes | Degree/subject/country/status filters; detail with intakes, requirements, linked funding, official URL, provenance and revisions. |
| Requirements | Claim table grouped by programme/intake; status, score/condition, applicant group, evidence snippet, verified date and conflict indicator. |
| Funding | Provider, amount/coverage, eligible degrees/regions, deadline and linked programmes; expired items flagged. |
| Faculty | Institution/department/topic filters; current official profile, public email source, research topics, publications and recruiting evidence if any. |
| Review queue | Side-by-side staged/published diff, source page and evidence, confidence flags, approve/reject/correct actions with required reason on rejection. |
| Sources | Access/permission status, domain, adapter, schedule, allowed paths, last success, error rate; admin can enable, pause or edit. |
| Jobs | Queue/running/failed/completed tabs, counts, error summary, retry/cancel for authorized admin, source and run detail. |
| Scraper Engine / Autopilot | Manual job options and a persisted scheduler: interval, schedule/source-change triggers, due-only checks, approved source selection, max sources, mode and depth. Show the collector heartbeat, next queue time and last queue summary. Keep Start disabled if the worker is offline or there is no approved, enabled source. |
| Audit and Staff | Searchable actor/action timeline; admin-only invite, disable and role change with confirmation. |

## Interaction and visual rules

Use a restrained editorial style: clear type hierarchy, calm neutral surfaces, one brand accent for primary actions, and semantic status colors paired with text/icons. Tables provide sticky headers, aligned numeric values, obvious sort state, and column labels at every breakpoint. Status chips distinguish discovered, staged, published, stale, rejected and archived. Display source URL, `observedAt` and `verifiedAt` near consequential facts. Never show a missing score as zero or a missing requirement as waived.

Every route has a skeleton/loading state, useful empty state with next action, recoverable error state, and keyboard-visible focus. Destructive or publication actions require confirmation, show in-flight disabled state, and return a success message linked to the resulting record. Forms have inline validation and unsaved-change protection. Use semantic HTML, accessible labels and dialogs, minimum 44px touch targets, contrast meeting WCAG 2.1 AA, and reduced-motion support. Validate at 375–430px and 1440px+; do not alter the student site's desktop layout.

Current MVP interactions: staff login, published catalogue views, review queue, source registry, source creation, and overview are connected to the API. Review and source forms use native modal dialogs for focus containment and Escape handling. Publishing and rejection have a confirmation step; rejection requires a reason. Unsaved source details prompt before closing. Success and recoverable errors use dismissible status notifications. Requirement and job screens are navigation placeholders until their dedicated API flows are implemented. Source health and catalogue counts reflect API data; the concept image's sample figures are not displayed as production data.

The first design review should include real-looking sample states for a conditional IELTS requirement, an expired funding opportunity, a faculty email without current evidence, a duplicate institution, and a failed source job. The working MVP then uses the contracts in [API.md](API.md), not permanent local mock data.
