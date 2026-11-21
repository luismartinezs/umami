// appctl runs api/migrate.js before every start. Umami's schema is managed by Prisma
// migrations, applied from the operator's machine with ops/migrate before a deploy that
// needs them, so starting the service never changes the database.
console.log('umami: schema migrations are applied with ops/migrate, not on start');
