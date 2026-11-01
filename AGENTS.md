# HigherStudy agent instructions

Read [docs/CONTEXT.md](docs/CONTEXT.md) before implementing data work. This file governs the repository. [web/AGENTS.md](web/AGENTS.md) adds student-site UI rules; it does not override data integrity or security rules here. `web/PRD.md` describes the existing student UI, while [docs/PRD.md](docs/PRD.md) describes the MSZ data deliverable.

## Boundaries and vocabulary

- `web/`: existing student Next.js site. `admin/`: separate staff Next.js app. `apis/`: NestJS HTTP API on Fastify; queue consumers are planned. `collector/`: planned Python source adapters. Use Fastify plugins and request/reply types; do not introduce Express middleware.
- Use **institution**, **programme**, **intake**, **requirement claim**, **funding opportunity**, **faculty member**, **source evidence**, and **review decision** consistently. A programme is never a scholarship. Unknown admission data is never interpreted as waived.
- Organize Nest code by feature module. Keep controllers thin, business rules in services, database operations in repositories, and DTOs/guards within the owning module. Keep workers out of request handlers. Keep UI, state, validation, API clients, and display components separate.

## Data and source rules

- No collected fact is published without an attributable source URL, observation time, and review decision. A Studyportals result is a discovery candidate; official institution/funder pages establish admission and funding claims. Current institutional faculty pages establish current employment and public contact details.
- Check source terms, licence/access permission, and robots rules before enabling a connector. Do not evade access controls, bypass CAPTCHA, rotate proxies to avoid limits, or collect private email addresses.
- Store raw extraction in staging; normalize, deduplicate, validate, and review before publication. Preserve prior published versions on failed refresh. Record corrections and reviewer identity.
- Do not copy secrets or credentials from ScholarPass. Its committed Groq fallback key must be removed and rotated if active before reuse.

## Engineering and delivery

- Use typed contracts, strict validation, least-privilege authorization, bounded pagination, transactions for publication, idempotent jobs, and migrations for schema changes. Never enable ORM auto-sync in production.
- Design indexes from actual filters and `EXPLAIN (ANALYZE, BUFFERS)` evidence. Avoid N+1 reads, unbounded crawls/queries, and speculative caches.
- Add focused tests for extraction, normalization, permissions, migrations, and critical admin flows. Run relevant lint, typecheck, tests, and builds. Report any check that could not run.
- Update the appropriate document when behavior, schema, API, deployment, or source policy changes. Keep planned behavior labelled as planned until implemented.
- Make focused changes. Do not modify the existing student desktop layout when working on the admin app.

The detailed contracts and workflows are in [docs/TECHNICAL.md](docs/TECHNICAL.md), [docs/DATABASE.md](docs/DATABASE.md), [docs/API.md](docs/API.md), [docs/INGESTION.md](docs/INGESTION.md), and [docs/SECURITY.md](docs/SECURITY.md).

## Authorized OpenAlex metadata publication exception

Approved/enabled OpenAlex researcher metadata may be imported automatically under a recorded `source_policy` review decision, with evidence, revisions and audit history. Keep source attribution and distinguish last-known research affiliation from verified current faculty employment. Do not generate contact details, official profile URLs, titles or admission scores. Programmes and requirements retain their existing evidence/review rules.

## Staff acceptance of source-attributed listings

Staff acceptance may publish an approved Studyportals programme listing or OpenAlex institution metadata with source evidence and a recorded human review decision. Preserve null factual verification timestamps and unknown admissions; never promote discovery data to verified admission/funding claims. Keep catalogue reads bounded and use server pagination/facets rather than fetching the full faculty/programme catalogue during refresh.

## User-authorized automatic public contacts

The user explicitly requested automatic contact discovery and addition during faculty scraping. A matching named official institutional profile with one explicitly published public email may receive a recorded source-policy review decision, separate contact evidence, observation time, revision and audit. Source access checks and human source blocks remain enforced. Missing or conflicting identities stay unresolved; no guessed emails, private contacts or current-employment verification may be inferred.

The user also explicitly requested automatic institution discovery without manual setup. Approved OpenAlex institution registry metadata and homepages may be source-policy published with evidence, revisions and audit, without setting factual verification timestamps. This does not certify admission or funding claims.

## Fast Execution Mode

- **Zero-Latency Direct Execution**: When the user asks for a command, bug fix, feature, script, or edit, execute it immediately without pausing to write planning documents, proposals, implementation plans, or asking for confirmation unless explicitly told to "plan".
- **Action First**: Run necessary terminal commands and file modifications directly in the very first turn.
- **No Unsolicited Overhead**: Do not generate unsolicited walkthroughs, questionnaires, diagrams, or conversational fluff. Keep responses concise, direct, and actionable.

