# Umami operations

## Deleting sites

Deleting a website also deletes its analytics and related data. Match the user's
requested sites by **name, domain, and UUID** before deleting anything.

The dashboard's website settings → Delete can return HTTP 504 on Vercel
(observed 2026-11-03). Check whether the website still exists before retrying.
The following fallback successfully removed five retired sites:

1. From the repo root, run a temporary `.mjs` script with `pnpm exec tsx`.
2. Load `dotenv/config`, then set
   `process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL`.
   Never print connection strings or credentials.
3. **After setting the URL**, dynamically import `deleteWebsite` from
   `./src/queries/prisma/website.ts` and the default `prisma` export from
   `./src/lib/prisma.ts`.
4. Read `prisma.client.website.findMany({ select: { id: true, name: true, domain: true } })`.
   Assert every requested name/domain matches its intended UUID before any write.
5. Call `await deleteWebsite(id)` sequentially for the verified targets. Reuse
   this application routine: it handles dependent data and transactions. Do not
   replace it with a bare SQL deletion of the `website` row.
6. Verify the remaining UUIDs equal the original set minus the requested targets;
   disconnect with `await prisma.client.$disconnect()` in `finally`.
7. Refresh `/websites` in the authenticated dashboard and confirm the removals.
   Remove the temporary script afterward; keep credentials out of Git.

## Production

Self-hosted on the deploy box at https://umami.appforgelabs.com (moved off Vercel
2026-11-21), through `~/dev/shared-infra` `appctl` with `ops/production.json`.

- Deploy: commit, then `~/dev/shared-infra/appctl deploy ops/production.json`.
  The release is the Next standalone server run by Bun (`ops/build-release`).
- Schema: a release never migrates on start. When `prisma/migrations` gains a
  migration (usually from an upstream merge), run `ops/migrate --dry-run`, then
  `ops/migrate`, before deploying. It applies Prisma's SQL as `umami_user` and
  records it in `_prisma_migrations` with Prisma's checksum.
- Runtime secrets: `.env.prod` (gitignored; `APP_SECRET`), rendered by
  `ops/render-env`. `DATABASE_URL` comes from appctl's `/etc/umami/database.env`.
- Upstream: `git fetch upstream && git merge upstream/master`. Builds stop on a
  Next.js version with a published advisory; bump `next` to the patched release.
- The old Supabase database (`.env`) holds the pre-migration copy; it is no
  longer written to.
