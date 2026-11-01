# Technical architecture

**Status:** target architecture; current code is a Nest starter and a JSON-backed student site. See [CONTEXT.md](CONTEXT.md).

## Services and flow

```text
Studyportals discovery / official university, funder and faculty pages
  → Python collector adapters → authenticated ingest batch
  → NestJS validation → PostgreSQL staging → editor review
  → transactionally published catalogue → public API → student site
                                  ↘ admin API → separate admin app
Redis/BullMQ coordinates scheduled collection, retries and refreshes.
```

`apis/` is one modular NestJS deployment using the **Fastify adapter**, with API and queue worker processes from the same codebase. `collector/` is a separate Python process, created by porting selected ScholarPass adapters. `admin/` and `web/` are separate Next.js deployments. PostgreSQL is authoritative; Redis is a queue and limited cache, never the record of truth. Never fetch an external source in a public request.

## NestJS ownership

```text
apis/src/
  config/                 # validated environment configuration
  common/                 # request IDs, errors, pagination, guards
  database/               # SQL client, migrations, transaction helpers
  modules/
    auth/                 # staff sessions, MFA, role policy
    institutions/         # institution/department identity
    programmes/           # programme, subject and intake
    requirements/         # requirement claims
    funding/              # funding opportunities and links
    faculty/              # faculty and research metadata
    sources/              # registry, access decisions
    ingestion/            # batch contract, staging, matching
    review/               # publish/reject/correct, revisions
    jobs/                 # scheduling, status, retries
    search/               # public query composition
    audit/                # immutable staff events
  workers/                # BullMQ processors and scheduler
  health/                 # readiness/liveness
```

Each module co-locates controller, DTO, service, repository and tests. Controllers do no SQL or source fetching. Repositories use parameterized typed queries and explicit projections. Cross-module work goes through exported services, not another module's tables. The API owns record state and publication; the collector owns fetching/parsing only. Version the ingestion DTO so Python and Nest can evolve independently.

## Implementation choices

- PostgreSQL 16+, migration-managed parameterized SQL through `pg`, Redis/BullMQ, OpenAPI, and strict TypeScript. The HTTP adapter is Fastify with `@fastify/cookie` and `@fastify/helmet`; do not add Express middleware or request types. Use PostgreSQL full-text search first; add an external search service only after measured relevance/latency needs.
- Public GETs read published rows and use stable keyset pagination. Detail endpoints fetch evidence and relationships with bounded queries. Short Redis TTLs may cache common aggregate counts, invalidated on publication; no blanket response caching.
- Ingestion uses bounded batches, a source-scoped idempotency key, content hashes, and a transaction for accepted publication. Keep staging and published data separate. Partial jobs report counts; failed refresh never deletes published rows. Publication also updates the programme's denormalized `country_code` from its institution for indexed public search.
- Logs include request/job/source IDs and structured error codes, excluding secrets and page content. Metrics include API latency/error rate, queue age, source fetch success, parser yield, staged-to-published ratio, stale-data age and review backlog. Readiness checks database/queue connectivity; liveness checks process health.

## Deployment and sequence

Deploy PostgreSQL, Redis, Nest API, Nest queue worker, Python collector, admin Next app and existing student Next app as separate processes. Restrict collector and internal ingest network access. Apply migrations before rolling out API changes; use backward-compatible schema/API changes for staged deployments.

Implementation order: (1) working admin shell and states against typed fixtures, (2) database/migrations and staff authentication, (3) admin catalogue/review APIs and UI connection, (4) source registry/queue/collector, (5) public APIs and student integration, (6) measured global expansion. Keep current `web/PRD.md` student scope intact. See [DATABASE.md](DATABASE.md), [API.md](API.md), [OPERATIONS.md](OPERATIONS.md).

### Empty-database faculty startup

OpenAlex faculty jobs bootstrap source-attributed institution anchors and homepage URLs from the education-institution registry when no institutions exist. Registry and author cursors are persisted; institution discovery advances after each institution batch is processed. Anchors are initially staged, then approved OpenAlex registry metadata is source-policy published under the user-authorized automatic discovery policy; factual verification timestamps remain null. Global faculty runs queue OpenAlex discovery, while official profile sources are consumed by the independent automatic contact loop. Slow contact pages no longer block programme/faculty collection. Programme cards expose institution homepages separately from programme-specific URLs; missing programme destinations are never replaced with a university homepage.
