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
