# Jalal Shops API

TypeScript/Express API for the public website and administration dashboard. It uses PostgreSQL through Prisma, revocable bearer sessions, Vercel Blob for images, and one serverless-safe Express entry point.

## Local setup

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `AUTH_SECRET`, and the frontend origins.
2. Run `npm install`.
3. Run `npm run migrate:deploy`.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ characters), and `ADMIN_NAME`; provide either `BLOB_READ_WRITE_TOKEN` or `SEED_ASSET_BASE_URL`; then run `npm run seed`.
5. Run `npm run dev`.

When run from this monorepo with `BLOB_READ_WRITE_TOKEN`, the seed uploads the existing files from `website/assets` to Vercel Blob automatically. Alternatively, `SEED_ASSET_BASE_URL` can point to an HTTPS object-storage/public directory containing those filenames. Seeding is idempotent: it creates the initial website content without overwriting content later edited in the dashboard. `npm run admin:create` can safely create or rotate the admin password separately.

The public API is rooted at `/api`. For local frontends, use:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The dashboard also needs `VITE_USE_MOCK_API=false`.

## Deployment order

1. Create a pooled, serverless-compatible PostgreSQL database.
2. Create a Vercel Blob store.
3. Deploy this folder as its own Vercel project and add every variable from `.env.example`.
4. Apply migrations with `npm run migrate:deploy`, then seed/create the administrator.
5. Set both frontend projects' `VITE_API_BASE_URL` to `https://BACKEND_DOMAIN/api`; set the dashboard mock flag to `false`; redeploy them.

Production CORS uses exact `WEBSITE_URL` and `DASHBOARD_URL` origins. Do not include a trailing slash.

## API map

Public: products, categories, hero, about, highlights (`/statistics`), contact, social links, and public settings.

Admin: authentication plus protected CRUD under `/api/admin` for products, categories, hero, about, highlights, contact, social links, settings, and image uploads.

All JSON responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": ..., "code": ... }`.

## Verification

```bash
npm run prisma:validate
npm run build
npm test
```

The automated suite checks security headers, CORS, admin protection, malformed JSON, error envelopes, and the exact frontend payload contracts. Database-backed CRUD should additionally be exercised against the target PostgreSQL environment before production launch.
