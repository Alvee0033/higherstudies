# HigherStudy Admin

Separate Next.js editorial dashboard for HigherStudy. It connects to the Fastify-backed Nest API in `../apis/` for staff sign-in, published catalogue views, review decisions, and source registration.

Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_API_URL`, then run `npm install` and `npm run dev -- --port 3001`. Set the API's `CORS_ORIGINS` to `http://localhost:3001`. Create a staff account through the API's `admin:create` command. The dashboard shows empty states until published data exists.

Run `npm run lint` and `npm run build` before release. See [admin design](../docs/DESIGN.md) and [security](../docs/SECURITY.md).
