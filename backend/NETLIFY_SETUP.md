# Deploying the backend to Netlify (functions)

This repo's backend is implemented as an Express app (TypeScript). To run it on Netlify we expose the app as a Netlify Function using `serverless-http`.

Key points
- The TypeScript build outputs to `dist/` via `pnpm build` (or `pnpm run build`).
- A serverless wrapper is provided at `functions/index.js` which imports the compiled `dist/app` and exposes `handler`.
- Cron jobs or long-running background tasks should NOT be started inside a serverless function. The wrapper intentionally avoids starting jobs.

Recommended Netlify site settings (deploying the `backend` folder as a site)
- Base directory: `backend`
- Build command: `pnpm build`
- Publish directory: `backend` (or leave empty since functions are the main output)
- Functions directory: `backend/functions`

Environment variables
- Configure the same env vars you use locally in the Netlify UI (Site settings → Build & deploy → Environment). Important ones include:
  - `MONGO_URI` (or whatever your `connectDatabase` expects)
  - `JWT_SECRET`, `CORS_PATH`, etc.

Local testing
1. Build locally:
   ```bash
   cd backend
   pnpm install
   pnpm build
   ```
2. Verify `dist/` was produced and `functions/index.js` can import it.

Notes and caveats
- Netlify Functions are ephemeral; don't rely on persistent in-memory state.
- If you need scheduled jobs, use Netlify Scheduled Functions (or an external scheduler) instead of running cron inside the function.
- If you prefer using the full server (not serverless), consider deploying to Render, Fly, Heroku, or a VPS.
