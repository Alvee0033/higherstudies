# HigherStudy data platform: context

**Status (20 October 2026):** implementation in progress; deployment remains pending. MSZ's initial assignment is (1) master's/PhD programme and scholarship discovery with programme-specific admission requirements, and (2) faculty names, public institutional emails, and research areas. A later engagement may broaden scope.

## Current repository

`web/` is a Next.js 16 student site. University and faculty pages use the public API and show an empty state when there are no review-approved records. The dashboard reads live catalogue counts. Student registration/login now uses separate Argon2-backed accounts, revocable sessions, CSRF protection, and rate-limited NestJS routes; the dashboard route checks the student session. Student applications, profile, settings, saved items, and email tracker now use authenticated, persisted student APIs. AI generation, payments, avatar upload, and saved search alerts have no configured provider and are shown as unavailable. Public programme and faculty lists use bounded catalogue APIs; unavailable admission facts remain unknown. `apis/` is a Fastify-backed NestJS API with PostgreSQL migrations, staff and student sessions, public catalogue reads, internal staging ingestion, source registration and review decisions. `admin/` is a separate Next.js editorial dashboard. A separate collector worker now records its heartbeat and consumes approved, enabled jobs. The local worker is running; approved sources are enabled and active jobs honour configured source cooldowns. Studyportals discovery, OpenAlex institution/researcher metadata, and targeted official faculty contact extraction are implemented; official admission requirement and funder adapters remain outstanding. Production deployment remains pending. [web/PRD.md](../web/PRD.md) is the existing student UI reference. [PRD.md](PRD.md) defines the new data deliverable.

### Local catalogue audit (18 October 2026)

The current local database contains development/demo data and must not be described as verified coverage: 675 published institutions, 1,078 published programmes, 8 funding opportunities, and 67 published faculty records. All 1,078 programme records are attributed to the Studyportals discovery source; the legacy importer generated IELTS/GRE claims and Fall 2027 deadlines instead of extracting those facts. The faculty audit found 67 rows linked to the Studyportals source, 59 generic evidence excerpts, 58 ORCID/OpenAlex identifiers used as if they were official faculty profile URLs, and 60 emails matching the old collector's generated-address pattern. These values are not safe for publication. The legacy programme and faculty importers now stop with an explanatory error; the demo seed requires an explicitly named demo command. Existing database rows were not deleted or rewritten during this audit.

The Scraper Engine currently queues jobs only. The new Autopilot setting persists a schedule and queues approved, enabled source jobs on its configured interval or when an approved source is enabled. It remains a **queue scheduler**, not a scraper; the admin panel displays this limitation. The three seeded local sources had no crawl-job history; their permission statuses were reset to pending, enabled flags turned off, and seeded last-success timestamps cleared. Review actual terms/access before enabling any connector. Review publication now rejects pending/disabled sources and Studyportals discovery records, and the legacy direct canonical ingestion routes are disabled in favor of staging batches. This does not make the existing local catalogue verified or create new scraped data.

### Student website status (18 October 2026)

The student login/register flow now calls `/v1/student/auth/*`; student passwords are Argon2 hashed, session and CSRF values are stored hashed in PostgreSQL, and browser sessions use HttpOnly cookies. Dashboard routes require a valid student session. Student workspace CRUD now persists applications, outreach records, saved items, profile and settings per authenticated student.

## ScholarPass evidence and reuse

The ScholarPass repository is `/home/alvee/Desktop/Projects_and_Code/Projects/scholarhip` (Git remote `Alvee0033/scholarpass`). Its Python `scholarship-scraper/spiders/studyportals_spider.py` calls `https://search-api.prtl.co/programmes/search` with `httpx`, paging Bachelorsportal, Mastersportal and PhDportal search cards. It extracts title, institution, portal URL, location, duration, tuition and occasionally a deadline. It currently maps programmes to `ScrapedScholarship`; this must be replaced with a programme DTO. It does not collect IELTS/GRE rules, verified scholarship eligibility, or faculty information.

ScholarPass also has separate university scholarship discovery/crawl code using Scrapling, a Python orchestrator sending batches to a NestJS ingestion endpoint, and a source/catalogue service. The inspected orchestrator invokes the Studyportals spider, not the university page spider. Its `university_sources.json` has 23,047 institution candidates; this is a seed list, not verified live coverage. Its expected local Studyportals export JSON files were absent. Reuse design patterns and carefully port code; never copy its secrets or assume its data is licensed for republication.

## Decisions and order

1. Build a **separate, working** Next.js admin MVP with editor/admin roles and reviewable design.
2. Add PostgreSQL schema, migrations, staff auth, and NestJS catalogue/admin APIs.
3. Add collection workers and a permitted Studyportals discovery adapter, then official institution/funder/faculty adapters and review workflow.
4. Connect the student site to published APIs, replacing local JSON incrementally.
5. Expand worldwide coverage through measured onboarding. Report verified institutions/programmes and missing fields instead of claiming completeness.

Production-scale use of Studyportals' internal endpoint is gated on confirmed access and usage rights. Source-specific access decisions live in the source registry. Official pages are the authority for published requirements and funding claims. See [INGESTION.md](INGESTION.md) and [SECURITY.md](SECURITY.md).

## Document map

[PRD.md](PRD.md) defines outcomes; [DESIGN.md](DESIGN.md) specifies admin UX; [TECHNICAL.md](TECHNICAL.md) describes services; [DATABASE.md](DATABASE.md) defines persistence and indexes; [API.md](API.md) defines HTTP contracts; [INGESTION.md](INGESTION.md) defines collection; [SECURITY.md](SECURITY.md) defines controls; [OPERATIONS.md](OPERATIONS.md) defines runbooks. The earlier [data-platform-backend-design.md](data-platform-backend-design.md) is background research; the documents above supersede its schema and API suggestions.

### Collection update (19 October 2026)

Manual collection now uses a Programmes / Faculty / All selector. Both collectors paginate beyond their old sample limits, persist progress after each page and rotate between jobs after two pages. Active source jobs are reused and repeated source records are deduplicated. OpenAlex research metadata now uses an automatic, audited source-policy publication decision; it does not assert verified current employment or generate contact details. Seventy-five previously pending OpenAlex records were imported using this policy. A live continuation increased the actual OpenAlex catalogue to 150 records before the provider rejected its next cursor with HTTP 401; configure `OPENALEX_API_KEY` to resume it. Programme collection remains active independently. The 67 legacy faculty rows attributed to Studyportals were quarantined as stale because their identity/contact provenance is invalid. Official programme requirement extraction remains unimplemented; IELTS/GRE minimums must not be generated from defaults.

### Programme tuition display (19 October 2026)

Reviewed Studyportals tuition arrays now persist in `programme.tuition` (migration 010), including amount, currency and period. The catalogue API and admin cards expose those source-listed fees separately from admission notes. Multiple listed fees retain their values without inferring residency eligibility; missing fees display Not collected. Approved existing staged fees are backfilled by the migration. These amounts are source attributed, not independently institution verified.

Programme listing publication now preserves valid HTTPS university programme links from collector payloads without setting verification timestamps. Portal tracking links are excluded from official URLs. The reviewed Wellington Education Policy listing has an audited direct university programme link; unavailable destinations remain labelled View on Studyportals.

### Source-listed programme details (19 October 2026)

Studyportals search collection now extracts actual duration, intake starts, applicant-category deadlines, delivery/attendance flags, summary and visible IELTS/TOEFL/PTE/Duolingo scores. Reviewed listing publication stores these in `programme.source_details` (migration 012); catalogue responses and admin cards display them with source-listed attribution and expandable intake details. These are separate from officially reviewed `requirement_claim` records. Unknown values are not inferred. Search cards that omit teaching language retain unknown language; scholarship advertisements do not create funding opportunities.

### Faculty public contact enrichment (19 October 2026)

Staff may queue contact collection from an approved official faculty source using `POST /v1/admin/catalog/faculty/:id/contact-jobs` with `sourceId` and `profileUrl`. The faculty inspector exposes this action. The worker checks robots rules, pins public DNS addresses, bounds requests and matches the named profile before extracting explicit public mailto contacts; ambiguous results are omitted. Contact candidates enter the faculty review queue. Acceptance updates the matched existing faculty member, preserving research metadata and current-employment verification status. Migration 013 stores separate contact evidence and verification time; catalogue responses expose `public_email_source_url` and `public_email_verified_at`. L3S Wolfgang Nejdl collection and staff-session acceptance were tested end to end. Source searches and universal profile discovery remain separate from this targeted extraction. CORS explicitly permits the authenticated PUT/PATCH/DELETE methods used by admin actions. Student workspace implementation resumed after the faculty contact task.

### Fully automatic contact attempt pipeline (19 October 2026)

The user superseded manual per-faculty contact submission: OpenAlex imports now enqueue contact discovery automatically, and the collector drains the durable queue for existing faculty too. Actual institutional directory links are discovered and unambiguous public emails are auto-published with separate source-policy evidence/revisions/audit. Source access checks, robots rules, linked terms checks, DNS restrictions and identity ambiguity still constrain coverage; there is no guarantee every faculty member has an accessible public contact. Statuses distinguish queued/running, not found, failed/retry, and source access needed. Migration 017 restores reviewed institution homepage values previously omitted by metadata publication. Student workspace migration 014 supplies persistence tables; the workspace module and student UI now use them.

### Fresh-start registry and websites (19 October 2026)

The user explicitly removed manual institution setup from collection. A fresh OpenAlex faculty run now discovers education institutions, saves source-attributed homepage links, stages them, and source-policy publishes registry metadata with revisions/audit and null factual verification. It then collects affiliated researchers and triggers automatic contacts. This supersedes older instructions requiring staff acceptance for every OpenAlex registry institution. Generic official-faculty sources no longer enter global crawl jobs: they are consumed by automatic contact enrichment, avoiding the missing-institution startup failure. Programme cards show a separate University website action and programme-specific destinations when collected; missing programme links are not invented or replaced with homepages. The empty-registry run was verified live with 100 institution/homepage records and 300 faculty records.
