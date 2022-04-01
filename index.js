const debug = require('debug')('Express:Server');
const http = require('http');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

debug('process.env.DATABASE_URL = ', process.env.DATABASE_URL);

const server = http.createServer(app);

server.listen(PORT, () => {
    debug(`✅ Server listening on http://localhost:${PORT} ✅`);
});
