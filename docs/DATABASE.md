# PostgreSQL data model and performance

**Status:** planned migration contract. PostgreSQL is authoritative. `programme` and `funding_opportunity` are distinct entities linked through `programme_funding`. UUID primary keys; `created_at`/`updated_at` are `timestamptz`; monetary values are `numeric` plus ISO currency; deadlines are dates with source timezone when published as date-only.

## Core tables

| Table | Required fields and constraints |
| --- | --- |
| `staff_user`, `staff_session`, `mfa_credential` | User email unique, role `editor/admin`, password hash, disabled state; session token hash, expiry/revocation; encrypted MFA secret. |
| `student_user`, `student_session` | Student email unique, display name, Argon2 password hash; session token and CSRF hashes, expiry/revocation. Student-owned workspace records and profile tables are not implemented yet. |
| `institution` | Name, country code, city, official URL, status; optional unique ROR/OpenAlex IDs. `institution_alias` stores alternate names. `department` belongs to institution. |
| `subject` | Stable code, label, parent ID for controlled taxonomy. |
| `programme` | Institution FK, title, degree `masters/phd`, official URL, normalized identity key, subject FK, language/mode, status, verified time; `country_code` is a transactionally maintained copy of the institution country for the public filter index. `programme_intake` holds term, start/deadline and application URL. |
| `requirement_claim` | Programme FK, optional intake FK, type, state (`required/optional/waived/not_accepted/unknown`), numeric/text value and unit, applicant condition, source evidence FK, verified time, status. Overall and component test scores are separate claims. |
| `funding_opportunity` | Provider/institution FK if applicable, title, official URL, coverage/amount/currency, eligibility summary, deadline, status, verified time. `programme_funding` links opportunities to programmes with evidence. |
| `faculty_member` | Institution and optional department FK, name/title, official profile URL, public institutional email if verified, status, verified time. `faculty_identifier`, `faculty_research_topic`, `publication`, `faculty_publication` hold identifiers and research metadata. |
| `source` | Domain, owner, adapter, permission state/evidence, allowed paths, crawl policy, schedule, enabled state, last success. `source_page` holds canonical URL, ETag/hash, fetch status and timestamps. |
| `crawl_job`, `staged_record` | Source, run/status/counters/errors; typed staged payload, content hash, match candidate and review state. Unique `(source_id, external_id)` where available and `(source_id, idempotency_key)` for batches. |
| `source_evidence`, `record_revision`, `review_decision`, `audit_event` | Evidence URL, short excerpt, fetched time and content hash; immutable before/after revision reference; actor, decision/reason/time; append-only staff action metadata. |

Use foreign keys and `CHECK` constraints for valid ranges/statuses. `ON DELETE RESTRICT` for referenced source evidence and published entities; archive records rather than cascade deleting audit/revisions. Optional identifiers use partial unique indexes. Store flexible parser diagnostics in JSONB only in staging/source metadata; keep filterable published fields typed and normalized. Preserve source-native text alongside normalized values.

## Index plan

```sql
CREATE UNIQUE INDEX institution_ror_uq ON institution (ror_id) WHERE ror_id IS NOT NULL;
CREATE UNIQUE INDEX programme_official_url_uq ON programme (official_url) WHERE official_url IS NOT NULL;
CREATE UNIQUE INDEX source_page_url_uq ON source_page (source_id, canonical_url);
CREATE INDEX programme_public_filter_idx ON programme (country_code, degree, subject_id, id) WHERE status = 'published';
CREATE INDEX programme_institution_idx ON programme (institution_id, id);
CREATE INDEX intake_deadline_idx ON programme_intake (deadline, programme_id) WHERE deadline IS NOT NULL;
CREATE INDEX funding_open_deadline_idx ON funding_opportunity (deadline, id) WHERE status = 'published';
CREATE INDEX faculty_institution_idx ON faculty_member (institution_id, department_id, id) WHERE status = 'published';
CREATE INDEX review_queue_idx ON staged_record (review_state, created_at, id) WHERE review_state = 'needs_review';
CREATE INDEX job_source_time_idx ON crawl_job (source_id, started_at DESC, id);
```

Add GIN full-text indexes for programme title/description, funding title and faculty research topics; add trigram indexes only for name/alias matching proven necessary. The composite public filter index is a starting hypothesis: compare real filter combinations and `EXPLAIN (ANALYZE, BUFFERS)` before retaining/adding indexes. Avoid indexing every column. Use `(sort_value, id)` keyset cursors, bounded limits (default 20, max 100), explicit list projections and batched relation loads. Add per-query timeouts and pool limits. Partition only high-volume job/audit/source-page history after measured growth; define retention before partitioning.

## Publication and migrations

Staging upserts are idempotent by source identity/content hash. Matching priority: trusted external identifier → canonical official URL → institution/degree/normalized title candidate for human review. Do not automatically merge ambiguous identities. Publication transaction writes the canonical record, evidence relation, immutable revision and review decision, then emits cache invalidation/outbox event. A changed external page creates a new staged revision; an unchanged hash updates observation metadata only. Failed fetches leave the published revision untouched.

All schema changes use reviewed forward migrations with rollback strategy and data backfill plan. Never run ORM auto-sync in production. Seed only controlled taxonomies and development fixtures, not unverified scraped data. See [API.md](API.md) and [INGESTION.md](INGESTION.md).

Migration `008_collection_progress_research_metadata.sql` adds durable `crawl_job.progress`, nullable faculty official profile URLs, `profile_source_url`, provider-attributed `research_metadata`, and `review_decision.decision_method` (`staff` or `source_policy`). Automatic source-policy decisions use a null actor and retain revision/audit evidence; they do not set employment verification timestamps.

Migration `009_collection_pacing.sql` adds `crawl_job.runtime` and `source_collection_state` keyed by source ID. The latter stores validated request spacing/rest settings, a persistent record counter, reserved next request timestamp and server/periodic cooldown deadline. Atomic UPDATE reservations coordinate multiple workers without a process-local rate limit.

Programme official URLs are indexed but not unique (migration 011): several programme specialisations may share a university programme-family page. Discovery URLs retain their separate deduplication constraint.

Migration 015 adds `faculty_contact_task`, keyed by faculty ID, with queued/running/found/not_found/needs_source/failed status, bounded retry scheduling and a lease. The partial due index serves worker claims. Separate contact evidence remains in migration 013 fields; automatic contact publication retains null current-employment verification.
