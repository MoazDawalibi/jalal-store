# Jalal Shops Administration Dashboard

Independent React/Vite administration app for the existing public website. Local mock services remain available; setting `VITE_USE_MOCK_API=false` connects the dashboard to the Phase 3 backend.

## Run locally

```bash
npm install
npm run dev
```

The mock login accepts any valid email and non-empty password. Copy `.env.example` to `.env` when connecting an API.

## Website-aligned content contract

The source of truth is `src/types/content.ts`. The dashboard deliberately uses nested bilingual values (`{ en, ar }`) because that matches the public website directly and avoids lossy `name_en`/`name_ar` transformations.

Product payloads include every field consumed by the website:

- `name`, `description`, `categoryId`, `brand`, and `image`
- nullable `price` and `quantity` states used for “Ask for price” and “Contact store”
- `currency`, `featured`, and `isNew`
- color `variants` with swatch value, image, and optional bilingual overrides
- backend metadata: `active`, `displayOrder`, `createdAt`, and `updatedAt`

Categories include the bilingual description required by the website. Hero, About, Contact, Highlights, and Website Settings likewise mirror the exact public sections instead of generic CMS fields.

## Expected backend endpoints

```text
POST   /auth/login
POST   /auth/logout
GET    /auth/me
CRUD   /admin/products
CRUD   /admin/categories
GET/PUT /admin/content/hero
GET/PUT /admin/content/about
CRUD   /admin/statistics
GET/PUT /admin/contact
GET/PUT /admin/social-links
GET/PUT /admin/settings
POST/DELETE /admin/uploads
```

The API client sends a bearer token, unwraps the standard backend response envelope, and emits a centralized unauthorized event on HTTP 401.

Image fields receive preview data URLs in mock mode and public Vercel Blob URLs in backend mode. JPEG, PNG, and WebP files up to 4 MB are accepted.
