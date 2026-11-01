# Operations and release runbook

**Status:** evolving runbook. The Fastify-backed API, PostgreSQL migrations, separate admin dashboard, and standalone Node collector worker exist. The worker supports bounded Studyportals programme discovery only; official institution, funder and faculty adapters remain unimplemented.

## Local environment

Required local services: PostgreSQL 16+, Nest API, collector worker, separate admin Next app, existing student Next app. Maintain checked-in `.env.example` files without secrets. Required collector settings are `DATABASE_URL`, `INTERNAL_INGEST_SECRET`, `API_BASE_URL`, and optional `COLLECTOR_POLL_MS`. Never import ScholarPass `.env` values.

Start PostgreSQL, apply migrations with `cd apis && npm run db:migrate`, then start the API with `npm run start:dev`, the worker with `npm run worker:collector`, and the admin app separately. The `admin:create` script reads the initial administrator password from standard input; never ship default passwords. Keep local fixture data separate from collected production data. Run `npm run lint`, `npm run test`, `npm run test:e2e`, and `npm run build` in `apis/`, plus lint/build in `admin/`.

## Jobs and incidents

The Scraper Engine and Autopilot create durable `crawl_job` rows. The worker claims approved, enabled jobs and reports a heartbeat; the API treats a heartbeat older than 30 seconds as offline. Studyportals discovery is permission-gated and remains disabled in the local source registry until its access scope is confirmed. Worker online status does not mean any source is approved or currently crawlable. Autopilot defaults to disabled and should only be enabled for reviewed, implemented adapters.

The local catalogue includes known demo/import records with synthetic admission claims, faculty emails, and research metadata. Do not use these rows as production facts. `npm run db:seed:demo` is for disposable local databases only. The old programme/faculty collector scripts are intentionally disabled because they fabricated fields and published directly.

The admin Jobs screen exposes source, schedule, attempt, counts, error code and last success. A failed source enters backoff; repeated failures pause that source and alert operations. Retry only after checking permission and parser changes. A retry reuses idempotency keys and must not duplicate records. Parser drift is suspected when a normally productive source returns zero or sharp field-completeness decline. Pause, inspect permitted snapshots/fixtures, repair parser, test, then rerun into staging. Published data stays unchanged during failure.

Monitor p95 API latency, error rate, database connection use, slow queries, queue age, worker heartbeat, job failure rate, source `403/429`, publication lag, stale-record counts and review backlog. Put request/job/source IDs in structured logs. Alert on failed migrations, unavailable PostgreSQL, rising `5xx`, queue stall and expiring source permission.

## Backup, release and rollback

Back up PostgreSQL daily with point-in-time recovery where available; test restoration quarterly in an isolated environment. Back up source registry, review/revision data and audit logs with the catalogue. Rebuild worker state from heartbeat and durable job/source records after loss. Test migration on a recent backup and record rollback/backfill steps. Deploy additive schema first, then compatible API/worker/admin versions, then data backfill; remove old fields only after readers migrate.

Release gate: source rights reviewed; ScholarPass secret remediation complete; migrations tested; access/role, CSRF and SSRF tests pass; representative parser fixtures pass; catalogue precision sample meets [PRD.md](PRD.md) target; public results show source/freshness; admin loading/error/empty states and 375–430px/1440px layouts pass; observability and restore path verified. Publish coverage metrics with limitations instead of claiming global completeness.

Continuous collectors save page/cursor checkpoints to `crawl_job.progress`. Use target Programmes / Faculty / All, then Scrape. The worker rotates between active source jobs after two pages so a long faculty crawl does not starve programme collection. Stop preserves the latest checkpoint. Pressing Scrape resumes the latest interrupted run; active source jobs are reused. OpenAlex metadata automatically publishes with an auditable source-policy decision and does not claim verified current employment. For older pending OpenAlex metadata: build the API, then run `node scripts/publish-openalex-pending.mjs` from `apis/`.

### Collector pacing and live states

Migration `009_collection_pacing.sql` persists per-source request reservations, record counters and cooldown deadlines. Manual Scrape offers request spacing (2–60 seconds; default 5), a record rest threshold (100–5,000; default 500), and rest duration (30–3,600 seconds; default 120). Multiple processes reserve request slots atomically in PostgreSQL. Rest counters and server cooldowns survive worker restarts.

The collector honors numeric or HTTP-date `Retry-After` on 429/transient server failures and uses bounded retries. HTTP 401/403 stops collection with a blocked status and preserves progress; it is not automatically retried as though it were a rate limit. A successful later authorized request does not prove why an earlier 403 occurred. Staff can resume from the checkpoint when access is available.

The admin polls actual worker heartbeat and job runtime every three seconds, showing requesting, collecting, request interval waits, cooldown deadline/countdown, completion and blocked access. Scrape remains an asynchronous job so closing the page does not interrupt collection. Stop cancels an active cooldown as well as a fetch.

### Programme website backfill

Run `node scripts/backfill-programme-websites.mjs` from `apis/` to scan the approved Studyportals search source for direct university destinations. It uses shared pacing, a singleton database lock, a durable refresh job and checkpoint, bounded retries and Stop support through job cancellation. Restart the command to resume partial/failed runs; completed/cancelled runs do not silently restart. Only missing programme links with matching source evidence are filled, with a scoped audit entry. It does not change admission verification or invent unavailable destinations. Personal account passwords are not required or stored. Authenticated detail-page collection is not yet integrated into this worker.

### Automatic faculty contacts

The collector automatically enqueues missing public contacts for existing and newly imported faculty. It processes up to five leased contact tasks between crawl slices; admin faculty pages refresh pending contact statuses every 15 seconds. Inspect `SELECT status,count(*) FROM faculty_contact_task GROUP BY status` for coverage. `needs_source` indicates source access could not be checked automatically (for example, no linked terms page) and retries after one hour; it is not proof the person has no email. Negative completed lookups retry after 30 days. `node scripts/enrich-faculty-contacts.mjs` is a bounded maintenance command using the same evidence and publication policy. Migrations 015–016 are required; no new secret is needed.
