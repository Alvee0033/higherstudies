# HigherStudy: graduate programmes, funding, and faculty data

**Status:** design proposal, 17 October 2026. **Client:** MSZ. **Scope:** the two requested deliverables: (1) master's/PhD programmes, admission requirements and funding; (2) professors, institutional contact details and research areas. This document does not claim that a global complete dataset can be obtained from one site.

## Existing project and prior work

- `apis/` is a NestJS 12 starter with no persistence, ingestion jobs, or catalogue endpoints yet.
- `web/` is a Next.js application. Its university and professor screens load static JSON from `web/src/data/json/`. The university card model has one `ieltsScore` and one `greRequired` per *university*, but these requirements vary by programme, applicant group, and intake. Professor profiles are also illustrative data, not a verified directory.
- The ScholarPass Git repository is at `/home/alvee/Desktop/Projects_and_Code/Projects/scholarhip` (`origin` identifies `Alvee0033/scholarpass`). Its Python `scholarship-scraper/` and NestJS `scholarship-aggregation/` are concrete prior work. The earlier `/home/alvee/Desktop/Scholarpass` location found in editor history is stale.

### What ScholarPass actually implemented

- `spiders/studyportals_spider.py` paginates `https://search-api.prtl.co/programmes/search` by degree level for Bachelorsportal, Mastersportal and PhDportal. It maps search cards to a `ScrapedScholarship` shape: programme title, institution, portal URL, location, duration, tuition and an available deadline. It does **not** extract programme-specific IELTS/GRE, document requirements, confirmed funding eligibility, or faculty profiles. Its mapping treats programmes as scholarships, so that schema should not be reused unchanged.
- `core/orchestrator.py` currently invokes that Studyportals spider and sends batches to the NestJS `/api/scholarships/ingest` endpoint using an internal API key. A separate `ScholarshipSpider` crawls university funding pages with rate limiting, extraction and deduplication, and `UniversityDiscoverySpider` finds likely funding links, but the orchestrator path inspected does not invoke those spiders. The source registry and catalog services are reusable architectural patterns.
- `data/university_sources.json` contains 23,047 institution candidates with country, URLs and identifiers, including ROR/OpenAlex on some rows. It is a discovery seed, not proof of 23,047 verified active university catalogues. Local Studyportals export JSON files referenced by the seed script were not present in the checkout, so existing harvested volume was not verified.
- Reuse the batching, source registry, provenance, normalization and deduplication ideas. Split `programme` from `funding_opportunity`; add official-page verification and a distinct faculty pipeline. Before any reuse, remove a committed fallback Groq API key in `scholarship-scraper/test_groq.py` and rotate it if active; do not copy it into HigherStudy.

## Source strategy

Studyportals is the platform the client recalled: Mastersportal, PhDportal and Scholarshipportal are useful for **discovery and coverage comparison**. Studyportals says its catalogue contains hundreds of thousands of programmes and that its team monitors university websites. That does not establish a public bulk data licence or API for HigherStudy. Contact Studyportals for a commercial data feed/licence before copying its catalogue at scale. Until a licence exists, use its pages only to identify candidate programmes manually or within permitted use, then ingest facts from the awarding institution's official pages. Do not bypass access controls or assume that publicly visible pages permit wholesale republication.

| Record | Primary source | Secondary source / purpose |
| --- | --- | --- |
| University and programme | Official university programme catalogue and graduate admissions pages | Government/accreditation registries; Studyportals for discovery only, subject to permission |
| IELTS/TOEFL/GRE, GPA, documents, deadlines | Programme admissions page, then graduate-school and international-student policy pages | None for authoritative requirement values |
| Scholarship and assistantship | University funding page, funder/programme owner page | DAAD database, Erasmus Mundus catalogue for discovery; verify final eligibility and deadline at funder |
| Professor, public email, lab, research topics | Current university faculty directory and lab page | ORCID/OpenAlex for disambiguation and publication topics; Crossref for DOI metadata |

DAAD explicitly warns users to confirm terms with the programme contact. Erasmus Mundus directs applicants to each master's website for entry requirements and application steps. OpenAlex and Crossref provide documented research metadata APIs, but neither proves current faculty employment, public email, or an open PhD position. A paper affiliation is historical evidence only.

## Collection and publication rules

1. Maintain a source registry with domain, owner, permitted paths, terms/licence review date, crawl interval, parser version, contact, and robots policy. Prefer official feeds/APIs or written permission. Respect `robots.txt`, rate limits, `Retry-After`, and terms. Stop a source when permission is unclear or access changes.
2. Crawl only public pages. No login scraping, CAPTCHA evasion, proxy rotation, or private contact extraction. Store institutional emails only when publicly listed for academic contact. Provide a removal/correction channel and avoid automated unsolicited email.
3. Discover index/sitemap URLs, queue programme/funding/faculty detail pages, fetch with per-domain throttling and conditional requests, retain source URL and fetch timestamp, then parse into typed staging records. Keep limited raw snapshots for debugging, with retention and access controls.
4. Normalize institution identity (ROR where available), degrees, subject taxonomy, locations, currency, academic year/intake and dates. Deduplicate by official URL and institution + award + title; flag ambiguous matches for review. Do not merge a scholarship with a programme: model a many-to-many eligibility/link relationship.
5. Extract requirements as **atomic claims** with value, unit, condition, applicant group, intake, source URL, quoted evidence snippet, observed date and review status. Distinguish `required`, `optional`, `waived`, `not accepted`, and `unknown`; missing data must never mean waived. Preserve section text where rules are conditional. For IELTS/GRE, support overall/subscores, test versions, validity, exceptions and alternatives. Use rules/LLM assistance only to propose extraction; deterministic validation and human review publish consequential claims.
6. Publish only source-backed records. Show `last verified` and official link on each result. Expire time-sensitive deadlines and funding availability automatically; retain historical revisions. Never advertise a professor as recruiting unless a current official page explicitly says so.

## Proposed data model (PostgreSQL)

Core tables: `source`, `crawl_job`, `fetch_snapshot`, `institution` (`ror_id`, canonical name, country), `programme` (institution, title, degree, subject, mode, language, official URL, status), `programme_intake` (term, deadline, fee, currency), `requirement_claim` (programme/intake, type, operator, value, unit, condition, applicant region, status, provenance), `funding_opportunity` (funder, award, coverage, eligibility, deadline, official URL), `programme_funding`, `faculty_member` (institution, department, name, title, official profile URL, public email, research topics), `faculty_identifier` (ORCID/OpenAlex), `publication` (DOI, title, year), `faculty_publication`, `source_evidence`, and `review_event`. Use UUID keys, unique canonical URLs/identifiers, versioned claims and indexes on institution, degree, subject, country, deadline and faculty topics. Keep user saved items separate from ingest tables.

Every displayed fact needs `source_id`, `source_url`, `fetched_at`, `verified_at`, and a confidence/review state. Store email with source and verification date. Do not fabricate rankings, acceptance rates, funding, openings or match scores from missing data.

## Service architecture and API

Keep `apis/` as the public NestJS API. Add separate modules for `catalogue`, `funding`, `faculty`, `search`, `sources`, `ingestion`, and `review`. Run collection in background workers with a durable queue (for example Redis/BullMQ) and PostgreSQL; never scrape on a user request. Isolate each source adapter, HTML/PDF parser and normalizer. A scheduled refresh enqueues due sources; idempotent jobs, bounded retries, dead-letter handling and per-domain concurrency protect operations. Record fetch failures, parser drift, record counts, stale-data age and review backlog.

Public read endpoints: `GET /v1/programmes`, `/v1/programmes/:id`, `/v1/funding`, `/v1/funding/:id`, `/v1/faculty`, `/v1/faculty/:id`, `/v1/institutions/:id`. Support cursor pagination; filters for degree, subject, country, institution, language, IELTS/GRE constraints, funding type/deadline and research topic; return provenance and freshness. Search PostgreSQL full-text first, add a dedicated search engine only if relevance or scale warrants it. Admin endpoints for source configuration, job status, review/approve/reject and corrections require role-based authorization and audit logs. Rate-limit public search and admin actions; validate query bounds and never expose worker credentials.

Frontend integration should replace static JSON with typed API contracts incrementally. Move IELTS/GRE from university cards to programme detail/filter data. Show unknown/conditional requirements clearly, loading/empty/error states, and direct links to the official admission and funding pages.

## Delivery sequence and acceptance

1. **Pilot:** agree target countries and a manageable set of 10–20 universities. Build source registry, schema, 2–3 university adapters, one funding source adapter, faculty directory adapter, review UI/API and provenance. Import a small sample covering master's and PhD programmes. Measure coverage against official catalogues, not Studyportals totals.
2. **Validation:** manually audit a stratified sample of programme titles, IELTS/GRE claims, deadlines, scholarship eligibility, faculty email and current affiliation. Track precision, missingness, stale records and correction time. A claim without official evidence fails publication. Test changed HTML, duplicate names, conditional waivers, dead links and expired funding.
3. **Scale:** onboard institutions by source agreement and adapter quality; monitor drift and refresh schedules. Expand countries/subjects only when the pilot meets agreed coverage and accuracy targets. Global “all universities, all subjects” is a continuing data operation, not a one-time scraping milestone.

**Decisions needed before implementation:** target countries, languages, subject priorities, acceptable freshness (e.g. admission deadlines daily; programme/faculty pages monthly), whether Studyportals licensing is in budget, and who will review ambiguous claims. These choices affect coverage, cost and delivery time.

## Research references

- [Studyportals data and programme coverage](https://studyportals.com/for-institutions/data-and-insights/)
- [Studyportals collection and update explanation](https://studyportals.com/for-institutions/data-and-insights/frequently-asked-questions/)
- [DAAD scholarship database and disclaimer](https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/)
- [Erasmus Mundus Joint Masters](https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters)
- [OpenAlex API endpoints](https://help.openalex.org/api/endpoints/)
- [Crossref REST API](https://support.crossref.org/hc/en-us/articles/214320426-REST-API)
