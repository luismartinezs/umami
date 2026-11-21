// appctl entry point (api/index.js in the release), run by Node 22. The release root holds
// the Next standalone server (an ES module, like this file: the release's package.json has
// "type": "module"). appctl's runtime.env sets API_HOST/API_PORT; Next reads HOSTNAME/PORT.
process.env.HOSTNAME = process.env.API_HOST || '127.0.0.1';
process.env.PORT = process.env.API_PORT || '3000';
process.env.DISABLE_TELEMETRY = process.env.DISABLE_TELEMETRY || '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';

await import('../server.js');
