# Source collection and publication

**Status (21 October 2026):** a separate collector worker consumes approved jobs and reports a heartbeat. Studyportals programme discovery, OpenAlex institution/researcher metadata, and targeted official faculty contact extraction are implemented. Official admission requirement and funder adapters remain incomplete. ScholarPass is a reference, not a drop-in dependency; see [CONTEXT.md](CONTEXT.md).

## Source policy

Register each source with owner, domain, adapter, permitted paths, licence/terms evidence and review date, robots status, request interval, concurrency, timeout and refresh frequency. An administrator must set permission state to `approved` before scheduling; `pending`, `blocked`, and `revoked` sources cannot run. Stop collection if access or terms change. Never use login scraping, CAPTCHA bypass, stealth/proxy rotation to evade limits, or private contact collection. Public institutional faculty emails may be stored with source evidence and removal/correction handling.

Studyportals: the worker adapter can page the registered search endpoint as an isolated **programme discovery** source only after the source has approved permission and is enabled. Its endpoint is undocumented, so parser and access can change without notice. The adapter extracts only listing fields and sends them to staging; it does not generate IELTS/GRE claims, deadlines, or faculty records. Do not treat portal data as authoritative scholarship or admission facts. The published Studyportals terms reserve rights not expressly granted and make use dependent on the granted scope; confirm a written licence/permission that covers this collector and HigherStudy's use before approving the source: [Studyportals Terms of Use](https://studyportals.com/terms-of-service/). University/funder pages supply official programme details, requirement claims, funding eligibility and current faculty profiles. OpenAlex/ORCID/Crossref may enrich research identity/topics, but publications do not prove current employment or open positions.

## Pipeline

1. Scheduler selects approved due sources and creates `crawl_job` with an idempotent source/window key. The separate `npm run worker:collector` process records a heartbeat and claims jobs with `FOR UPDATE SKIP LOCKED`.
2. Collector fetches public indexes/sitemaps or permitted API pages. Use conditional requests, per-domain concurrency, bounded pages/depth, `Retry-After`, exponential backoff and a stable user agent/contact. Check redirects and resolved IPs before each fetch.
3. Adapter parses typed candidates. Persist source URL, external ID, observed time, content hash, parser version and short evidence excerpt. Reject malformed/unsupported values; missing fields remain unknown.
4. Send bounded versioned batches to `/v1/internal/ingestion/batches`. Nest validates and stores `staged_record`; a job failure cannot alter published records.
5. Normalize degree, subject, dates, currency and institution identity; match trusted IDs/official URLs first. Ambiguous duplicates and conflicting requirement claims go to review.
6. Editor compares staged versus published values and source evidence. Approval writes canonical entities, `source_evidence`, `record_revision` and `review_decision` transactionally. Rejection records a reason. Corrections retain the original extracted value and reviewer edit.
7. Refresh by field/source cadence; mark claims stale when evidence ages past policy, expire deadlines and funding separately, and request review on changed official pages. No automatic assertion that a professor is recruiting.

## Quality and recovery

Track source yield, parse failures, duplicate rate, evidence coverage, review precision, stale age and per-country verified coverage. Alert on zero-result parser drift, repeated `403/429`, expired permissions and rising review backlog. Bounded retries go to a dead-letter state with an admin-visible error; retrying uses the same idempotency identity. Preserve last verified publication when a crawl fails. Raw snapshots, if retained for diagnosis, are access-controlled and expire per [SECURITY.md](SECURITY.md). Test parsers with saved permitted fixtures and changed-page cases; never use live third-party sites as the sole CI test dependency.

### Official faculty adapter and live collection controls (19 October 2026)

`official-faculty` preserves a registered directory/profile path and collects explicit JSON-LD `Person` records from that institution's HTTPS pages. The source host must match an institution's `official_url`. The adapter reads robots.txt, conservatively honors disallow prefixes, follows only same-origin faculty/people/profile links, limits shallow/medium/deep runs to 1/5/15 pages, throttles requests, and stages attributable names, explicitly published emails, job titles and research topics. Pages without structured Person data fail with an actionable message and require a dedicated adapter. No faculty source is automatically registered or approved.

Staff can verify source reachability with `POST /v1/admin/sources/:id/verify`; this checks public HTTPS and robots availability and does not certify licence or factual correctness. Public IPv4 resolution is pinned per request; private/reserved addresses, redirects, nonstandard ports and responses over 2MB are rejected. IPv6-only hosts currently need an adapter update.

The admin collection monitor polls every three seconds, displays actual found/staged/error counts, previews the latest 20 staged records via `GET /v1/admin/jobs/:id/preview`, and calls `POST /v1/admin/jobs/:id/cancel` to stop queued/running jobs. Worker requests are aborted after cancellation is detected and terminal status is preserved. Staging rejects cancelled jobs. Progress is indeterminate because the total number of discoverable pages is unknown. Preview is staging data and does not imply publication. Bulk review applies version-checked decisions individually and reports partial failures; rejection requires a shared reason.

### OpenAlex researcher source (implemented 19 October 2026)

Migration `007_openalex_source.sql` registers the CC0 OpenAlex API as an approved, enabled `openalex-authors` source. The collector filters authors by an institution's exact OpenAlex identifier using `last_known_institutions.id`; it stages names, identifiers, returned research topics, publication counts, citation counts and h-index. It does not infer emails, academic titles, official profile URLs, openings, or verified current employment. These discovery candidates require institutional evidence before publication. Source Verify checks the actual author endpoint. `OPENALEX_API_KEY` is optional for anonymous access and should be set when required by the provider or quota needs.

Shallow/medium/deep runs process the first 3/10/20 institutions with valid OpenAlex IDs in stable name order, up to 25 authors per institution, staging each institution separately for live preview. This is bounded initial collection, not exhaustive global coverage. The legacy `scrape-faculty.mjs` remains disabled; the queue worker now owns OpenAlex collection. See https://help.openalex.org/api/ and https://help.openalex.org/api/filtering/ .

The Scraper Engine now exposes one **Scrape all** action. It queues every approved, enabled source with an implemented adapter, reuses existing queued/running work for each source, and displays each collector's current status. Studyportals collects programme discovery; OpenAlex collects institution metadata alongside researcher metadata. Collection depth remains bounded; “all” means all connected data types and supported sources, not an unbounded global crawl. Stop all cancels active and queued jobs displayed by the monitor.

### Continuous collection and OpenAlex source policy (19 October 2026)

The operator chooses `programmes`, `faculty`, or `all` and presses Scrape. The manual jobs API accepts `target`. Programme collection advances through master's and PhD listing pages until the source returns its final page. OpenAlex uses cursor pagination for authors across all locally registered institutions carrying OpenAlex IDs, importing institutional metadata alongside researcher metadata. Requests remain bounded and throttled; Stop cancels work. A persistent `crawl_job.progress` checkpoint is committed after each staged page. A new run resumes the latest failed/cancelled run's checkpoint; completed runs restart enumeration for refresh. The per-source queue lock reuses active work, while source IDs/content hashes, OpenAlex IDs and batch idempotency keys prevent duplicate records. Provider failures and rate limits are retried finitely, then reported as failures that can be resumed.

**User-authorized publication exception:** approved/enabled `openalex-authors` faculty metadata is automatically published without a human queue step. It retains an approved staging snapshot, `source_policy` review decision, source evidence, revision and audit event. This certifies neither a current faculty appointment nor an official institutional profile. `official_profile_url` can be null; `profile_source_url` points to the OpenAlex author API and `research_metadata` retains provider metrics. Current employment remains unverified; missing contact details and job titles stay empty. `scripts/publish-openalex-pending.mjs` applies the same policy to previously staged candidates after building the API.

Admission minimums remain unavailable until actually extracted from authoritative programme pages. The disabled legacy importer generated IELTS/GRE values; these must never be restored as facts. The admin now labels missing admission requirements explicitly and has no numeric score fallbacks.

### Staff acceptance of discovery listings

Staff can accept Studyportals programme listings and OpenAlex institution metadata from the review queue. Listing publication resolves institution name/country, records source evidence and the human decision, deduplicates by discovery URL, and leaves admission requirements unverified. It does not create deadlines, test score minima, or official programme URLs. Bulk acceptance processes bounded batches and reports individual conflicts or malformed records.

OpenAlex institution collection now performs a separate bulk metadata pass for all registered institutions carrying OpenAlex IDs before continuing author cursor pagination. Provider-supported `ids.openalex` OR filters retrieve up to 100 institutions per request. Its `metadataOffset` checkpoint is separate from the author institution/cursor checkpoint, so a large author population at one university no longer delays discovery of other institutions. Source pacing and periodic rests remain enforced.

### Automatic public faculty contacts (19 October 2026)

Explicit user authorization now enables automatic publication of unambiguous public professional contacts. Faculty import enqueues a durable `faculty_contact_task`; the existing collector drains it alongside collection jobs, including a bounded backlog scan for existing faculty. Discovery follows actual profile/directory links on approved institutional origins and matches the named page before extracting one public email. Missing source origins can be registered automatically only after HTTPS, robots, and linked website terms checks pass; no terms page, prohibited crawling, ambiguous identities or unavailable public emails remain unresolved. Human source blocks are not overridden. Each automatic contact receives separate source evidence, observation time, a source-policy review decision, revision and audit event. It never verifies current employment, invents email addresses, or sends emails. Negative lookups have a 30-day cooldown; failures retry after one hour. A lease recovers interrupted tasks. `needs_source` records await an approved institutional source.
# OpenAlex collection checkpoint and credential rules (implemented)

An OpenAlex job discovers education institutions page by page using the saved
`institutionDiscoveryCursor`, even when the catalogue already has institutions.
Each page stages source evidence and updates the checkpoint before the worker
rotates to another queued job. Once discovery is complete, the same job
resolves institution identities and collects researcher metadata. New manual
jobs start at page one; an already queued or running job keeps its checkpoint.
Source record deduplication makes revisited pages safe.

Set `OPENALEX_API_KEY` for one credential. Additional credentials may be
provided through comma-separated `OPENALEX_API_KEYS` or numbered
`OPENALEX_API_KEY_2`, `OPENALEX_API_KEY_3`, and so on. `OPENALEX_MAILTO` is an
optional contact address, never an API key. The collector rotates credentials
on HTTP 401, 403 or 429 without logging their values. When all configured keys
are cooling down, the job remains queued with its cursor and a visible
`waitUntil`; other jobs can continue. The source request interval and periodic
rest settings still apply across keys.

Studyportals programme batches no longer issue extra OpenAlex lookups or
publish faculty directly. The OpenAlex job owns institution and researcher
discovery, so one source's rate limit and review policy cannot be bypassed by
another collector.

