# HTTP API contract

**Status:** implemented routes are identified below; user workspace CRUD remains planned. Prefix `/v1`; JSON over HTTPS; OpenAPI generation is planned. UUID IDs, ISO 8601 timestamps, ISO country/currency codes. Query DTOs reject unknown parameters and cap `limit` at 100 (default 20). The route taxonomy uses the vocabulary in [CONTEXT.md](CONTEXT.md).

## Public read API

Production public catalogue reads are release-gated by `PUBLIC_CATALOGUE_RELEASED=true`. Staff overview counts remain available at `GET /v1/admin/catalog/summary`.

| Route | Filters / result |
| --- | --- |
| `GET /v1/institutions`, `GET /v1/institutions/:id` | `q`, `country`, `cursor`, `limit`; official identifiers and published catalogue counts. |
| `GET /v1/programmes`, `GET /v1/programmes/:id` | `q`, `degree`, `subject`, `country`, `institutionId`, `language`, `funding`, `deadlineBefore`, `cursor`, `limit`; detail includes intakes and verified requirement claims. |
| `GET /v1/funding`, `GET /v1/funding/:id` | `q`, `degree`, `country`, `provider`, `deadlineBefore`, `cursor`, `limit`; detail includes eligibility and verified programme links. |
| `GET /v1/faculty`, `GET /v1/faculty/:id` | `q`, `country`, `institutionId`, `researchTopic`, `academicUnit`, `cursor`, `limit`; list responses include `created_at` for catalogue recency, not employment start dates. Public contact only when sourced. |

Lists return `{ "data": [...], "page": { "nextCursor": "..." } }`; `nextCursor` is `null` at the end. Detail returns `{ "data": { ... } }`. Records carry `status`, `verifiedAt`, `sourceUrl`, and relevant `sourceEvidence` summaries. Public API serves published records only; unknown requirements are represented explicitly, never omitted as a false waiver. Do not return raw page snapshots or staff identity publicly.

## Staff API (`/v1/admin`, authenticated)

`GET /v1/admin/review-items?state=needs_review&limit=100&offset=0&recordType=programme` returns a bounded, paginated review queue and source permission metadata. `GET /v1/admin/review-items/:id` returns the staged record. `POST /v1/admin/review-items/:id/decisions` accepts `approve` or `reject` with an expected version; rejection requires a reason. Stale revisions return `409`. Approval returns `403` unless the source is approved and enabled, and rejects Studyportals discovery records. Evidence must be HTTPS on the registered source domain, and publication URLs must match that official domain. `GET/POST/PATCH /v1/admin/sources` and `POST /v1/admin/sources/:id/jobs` configure/trigger sources (admin only). `GET /v1/admin/jobs`, `/jobs/:id` and `POST /jobs/:id/retry` monitor/retry (retry admin only). `GET /v1/admin/audit-events?limit=50&offset=0` and `/staff` plus staff invite/disable/role updates are admin only. Audit results are newest-first and capped at 100 per page. Editor may edit/review content but cannot manage source permissions, jobs, roles or platform settings.

In production, public catalogue summary, list, facets, and detail routes are held behind `PUBLIC_CATALOGUE_RELEASED=true`; keep this disabled until the catalogue release has been reviewed. Student registration is disabled in production until email verification and password recovery are implemented.

### Autopilot queue configuration

- `GET /v1/admin/jobs/autopilot` returns the persisted schedule and collector worker availability based on a heartbeat younger than 30 seconds.
- `PUT /v1/admin/jobs/autopilot` (admin only) saves `enabled`, `intervalHours` (1, 3, 6, 12, 24, 48, or 168), `triggerOnSchedule`, `triggerOnSourceEnabled` (an audit-logged approval/enable action), `onlyDueSources`, `sourceIds` (empty means all), `maxSourcesPerRun` (1–20), `depth`, and `mode`.
- The scheduler uses a PostgreSQL advisory lock and writes `crawl_job` entries for approved, enabled sources. The separate collector worker claims jobs with `FOR UPDATE SKIP LOCKED`; the only implemented adapter is bounded Studyportals discovery, which is permission-gated and stages candidates for human review.

Staff login/session routes: `POST /v1/admin/auth/login`, `POST /v1/admin/auth/mfa/verify`, `POST /v1/admin/auth/logout`, `GET /v1/admin/auth/me`, `GET /v1/admin/auth/csrf`. Mutations require session cookie plus CSRF token. Admin routes are not exposed in public OpenAPI documentation.

## Student identity API (implemented)

- `POST /v1/student/auth/register` accepts `{ email, displayName, password }` and creates an Argon2 password hash and session.
- `POST /v1/student/auth/login` accepts `{ email, password }`.
- `GET /v1/student/auth/me` returns the current student identity; `GET /v1/student/auth/csrf` returns the session CSRF token.
- `POST /v1/student/auth/logout` revokes the current session and clears cookies.

Student sessions use HttpOnly `SameSite=Lax` cookies and CSRF validation for mutations. Registration/login are rate limited. Passwords require 6–128 characters. Student email tracker routes are implemented and scoped to the authenticated student:

- `GET /v1/student/email-tracker?limit=100&offset=0` lists records (limit 1–100).
- `POST /v1/student/email-tracker` creates a record with faculty contact, institution, optional profile URL/subject, sent/follow-up/reply timestamps, status, and private notes.
- `PATCH /v1/student/email-tracker/:id` updates supplied fields; `DELETE /v1/student/email-tracker/:id` deletes only the owner’s record.

All mutations require the student session and CSRF token. This is a personal tracking log; it does not send email or create faculty catalogue records. The current migration is `apis/migrations/006_student_email_tracker.sql`. The student workspace is implemented. `GET /v1/student/workspace/summary` returns counts and recent records. `GET` and `PUT /v1/student/workspace/profile` and `/settings` read and save private JSON documents in `{data: {...}}`. `GET /v1/student/workspace/applications` lists applications; `GET /applications/:id` reads one, `POST /applications` creates one, `PATCH /applications/:id` updates one, and `DELETE /applications/:id` removes one. Writes use `{data: {...}}`. `GET /v1/student/workspace/saved` lists saved catalogue items; `POST` and `DELETE /saved/:kind/:id` toggle a published programme or faculty member. All routes require the student session and writes require CSRF. `POST /v1/student/auth/password` checks the current password and revokes other sessions.

## Internal ingestion API

`POST /v1/internal/ingestion/batches` is reachable only from the collector network and requires a dedicated credential. Request shape:

Legacy `POST /v1/internal/ingestion/programmes`, `/institutions`, and `/faculty` direct-publishing routes now return `403`; they bypassed source attribution and human review. Collectors must submit staged batches instead.

```json
{
  "schemaVersion": 1,
  "sourceId": "uuid",
  "runId": "uuid",
  "idempotencyKey": "source-run-batch-key",
  "recordType": "programme",
  "items": [{ "externalId": "source-id", "sourceUrl": "https://example.edu/programme", "payload": {} }]
}
```

`recordType` is one of `institution`, `programme`, `requirement_claim`, `funding_opportunity`, `faculty_member`. Max 100 items and a bounded request body. The API validates URL/source ownership and schema, stores staged records, and returns `{ "accepted": n, "unchanged": n, "rejected": n, "errors": [...] }`. Repeated source/idempotency keys return the stored result; they do not duplicate staging. Worker credentials cannot call staff/public mutation routes. Programme discovery results must use `recordType: programme`, never `funding_opportunity`.

## Errors and performance

Errors use `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "requestId": "...", "details": [...] } }`. Expected codes include `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`, `RATE_LIMITED`, and `SOURCE_UNAVAILABLE`; avoid leaking internal URLs/secrets. Use `429` with `Retry-After` where applicable. Cursor encodes stable sort value plus ID and is opaque to clients. Apply route-level rate limits, query timeouts, selected columns on list routes, and bounded relation fetches. See [SECURITY.md](SECURITY.md) and [DATABASE.md](DATABASE.md).

Collection controls: `POST /v1/admin/sources/:id/verify` (admin) checks registered source reachability, with an author API check for OpenAlex. `GET /v1/admin/jobs/:id/preview` (staff) returns the latest 20 staged records for a run. `POST /v1/admin/jobs/:id/cancel` (admin) stops queued or running jobs. Workers preserve cancelled status and staging requires a running job matching the source. Source verification does not itself approve access or publication.

Manual collection accepts `POST /v1/admin/jobs` with `{ "target": "all", "depth": "deep", "mode": "full" }`; target can also be `programmes` or `faculty`. Jobs expose `progress` for page/institution checkpoints. Faculty responses can include `profile_source_url` and provider-attributed `research_metadata`; `official_profile_url` and `verified_at` may be null for automatically imported OpenAlex research metadata. Such imports use automatic source-policy decisions rather than the human review queue.

Collection pacing is optional in the manual jobs body: `requestIntervalSeconds` (integer 2–60, default 5), `restEveryRecords` (integer 100–5,000, default 500), and `restSeconds` (integer 30–3,600, default 120). Settings apply to selected sources; active source jobs are reused. Job responses include `runtime` with `phase`, `message`, `waitUntil`, `httpStatus`, and `updatedAt`, allowing the admin to display actual cooldowns and source access failures. Worker availability is read from its recent heartbeat, not inferred from pressing Start.

Staff programme/faculty catalogue reads use `GET /v1/admin/catalog/programmes` or `/faculty`, with `limit` 1–100, `offset`, existing source/country/institution/degree/topic filters and `sort` (`newest`, `title-asc`, `title-desc`, `country`). Responses include the full matching `page.total`. Corresponding `/facets` endpoints provide country, institution and research-topic options without downloading every record. These staff read endpoints allow 300 requests/minute; public limits and login limits remain unchanged.

`POST /v1/admin/review-items/bulk-decisions` accepts `{decision,reason?,items:[{id,expectedVersion}]}` with 1–25 items and returns individual success/error outcomes. Every successful decision retains its own transaction, reviewer, version check and audit. The admin sends batches of 25 instead of a decision request plus CSRF request for every record.

Approved Studyportals programme candidates may now be accepted as source-attributed listings, using their discovery URL, listing country/degree/title and institution name. Their admission status remains unknown, and no IELTS/GRE claims or verification timestamp are generated. Staff may also accept OpenAlex institution metadata without claiming official institutional verification. Requirement and funding claims still require appropriate authoritative evidence.

`GET /v1/admin/review-items/selection` returns a compact `{id,version,label}` manifest in bounded keyset pages (limit 1–1,000). It accepts `recordType`, literal `q`, `cursor`, and a fixed `before` cutoff returned as `page.selectedBefore`. The admin's Select all snapshots every pending match across all pages, excludes subsequently collected records, and submits the captured expected versions in batches of 25. Changing review filters clears the selection. Navigating pages preserves it. Bulk progress shows the full selected count. Decisions are paced and the CSRF token is reused within the current staff session to avoid a request burst; login/logout/auth errors invalidate that cache.
