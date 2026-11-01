# Security and data governance

**Status:** mixed. The Nest API currently implements Argon2 password hashing, hashed server-side staff/student sessions, HttpOnly `SameSite=Lax` cookies, CSRF checks for guarded mutations, exact configured CORS origins, DTO validation, Helmet, and login rate limits. MFA, email verification/recovery, hardened production deployment, and several other controls below remain planned; do not treat this as a production security certification.

## Staff identity and authorization

Use Argon2id password hashing, secure HttpOnly `SameSite=Lax` server sessions with rotation after login/privilege change, idle/absolute expiry and revocation. Require MFA for administrators; recovery codes are single-use and hashed. Rate-limit login and MFA, record failed attempts without passwords, and provide account disable/session revoke. Admin app uses the Nest session through a controlled same-site deployment or server-side proxy; do not put bearer tokens in browser storage. State-changing requests require CSRF protection and origin validation.

| Capability | Editor | Admin |
| --- | --- | --- |
| Read catalogue, evidence, review queue and jobs | Yes | Yes |
| Correct/approve/reject staged content | Yes | Yes |
| Create/edit canonical content with audit trail | Yes | Yes |
| Enable sources, change permission/schedule, trigger/retry jobs | No | Yes |
| Manage staff/roles, settings, audit export | No | Yes |

Enforce roles in Nest guards and services, not only in the UI. Use least-privilege database users for API, worker and migration processes. Internal ingestion has its own scoped credential, constant-time comparison or signed requests, network restriction, rotation and rate limits. Validate all DTOs with whitelist/transform/reject unknown fields; set request body and upload limits. Configure exact CORS origins, Helmet, disabled `x-powered-by`, HTTPS/HSTS, query timeouts and safe error responses. Avoid public Swagger/admin metadata in production.

Student registration/login is served at `/v1/student/auth`. Passwords are hashed with Argon2; the API stores only hashes of random session and CSRF tokens. Registration and login are rate limited, state-changing guarded requests require CSRF, and student sessions expire after 30 days or explicit logout. Email ownership verification and password recovery are not implemented, so production registration must be gated until verification and recovery workflows are added.

The API blocks student registration in production until email verification and password recovery are implemented. Public catalogue routes return `503` in production unless `PUBLIC_CATALOGUE_RELEASED=true`. Keep the catalogue gate off until a reviewed data release confirms that legacy/demo claims and contacts are not being presented as verified facts. The catalogue gate is ignored outside production to keep local development usable.

## Collection and privacy

Guard against SSRF: approved domain/path allowlist, DNS and redirect revalidation, block loopback/private/link-local/cloud metadata IPs, HTTPS by default, limit redirects/response bytes/content types/time, and no arbitrary admin-provided proxy URL. Respect source permissions, robots and rate limits. Do not collect private emails, personal phone numbers, student records or inferred contact patterns. Store public institutional email only with a current official source; provide correction/removal process and retain audit of the decision without keeping removed personal data longer than needed.

Encrypt database/backups and any retained source snapshots at rest; restrict snapshot access to operations, not editors by default. Proposed retention: raw page snapshots 30 days, failed job diagnostics 90 days, session records until expiry plus 30 days, audit/review decisions 2 years unless law/contract requires otherwise. Review retention with the client and local legal requirements before production. Never log credentials, complete page bodies, MFA secrets or sensitive contact payloads.

## ScholarPass remediation

ScholarPass has a committed fallback Groq API key in `scholarship-scraper/test_groq.py`. Remove it from source and history where feasible, rotate/revoke it if active, scan the repository for other secrets, and use environment/secret-manager injection. Do not copy `.env` files, default internal keys, or proxy settings into HigherStudy. Confirm Studyportals access and republication rights before enabling production-scale collection.

Threat-model the admin login, ingest boundary, source URL fetcher, publication transaction and public search before release; test role bypass, CSRF, SSRF redirects, credential replay, excessive queries and audit tampering. See [OPERATIONS.md](OPERATIONS.md).
