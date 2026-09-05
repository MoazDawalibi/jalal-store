# Jalal Store

The repository contains the public storefront in `website/`, the admin app in
`dashboard/`, and the API in `backend/`.

## Storefront deployment

For the `jalal-store` Vercel project, keep **Root Directory** at the repository
root (leave it empty). The root `vercel.json` installs the storefront dependencies,
builds the Vite app, and publishes `website/dist`.

Deploying the repository root without this configuration can complete successfully
but return `404 NOT_FOUND`, because the storefront's `index.html` is nested inside
`website/` and must be built first.

To check the production build locally:

```sh
npm ci --prefix website
npm run build --prefix website
```

Set `VITE_API_BASE_URL` in Vercel when connecting the storefront to a deployed API
(see `website/.env.example`). Deploy the dashboard and backend as separate Vercel
projects with their respective folders as the Root Directory.
