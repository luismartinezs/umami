// appctl entry point (api/index.js in the release). The release root holds the Next
// standalone server; appctl's runtime.env sets API_HOST/API_PORT, Next reads HOSTNAME/PORT.
const path = require('node:path');

process.env.HOSTNAME = process.env.API_HOST || '127.0.0.1';
process.env.PORT = process.env.API_PORT || '3000';
process.env.DISABLE_TELEMETRY = process.env.DISABLE_TELEMETRY || '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';

require(path.join(__dirname, '..', 'server.js'));
