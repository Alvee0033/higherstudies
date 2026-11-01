# HigherStudy API

NestJS 12 API using the Fastify adapter, PostgreSQL, typed request validation, cookie sessions, and editorial staging. See the repository [architecture](../docs/TECHNICAL.md), [database](../docs/DATABASE.md), [API contract](../docs/API.md), and [security requirements](../docs/SECURITY.md).

## Local setup

1. Copy `.env.example` to `.env` and set a dedicated local PostgreSQL database URL and internal ingestion secret.
2. Run `npm install` and `npm run db:migrate`.
3. Create the first admin by piping a password of at least 6 characters to `npm run admin:create -- admin@example.com`. Do not pass passwords as command arguments or commit `.env`.
4. Run `npm run start:dev`. The API listens on `127.0.0.1:4100` by default. Set `CORS_ORIGINS` to the admin and student app origins.

The public routes read only published records. `POST /v1/internal/ingestion/batches` stages source records; editor approval is required to publish. New sources are disabled until an administrator records approval. The separate admin app lives in `../admin/`.

## Checks

Run `npm run build`, `npm run lint`, `npm test`, and `npm run test:e2e`. The migration script records applied SQL files in `schema_migration` and does not use schema auto-sync.
