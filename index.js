const debug = require('debug')('Express:Server');
const http = require('http');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);

const server = http.createServer(app);

server.listen(PORT, () => {
    debug(`✅ Server listening on http://localhost:${PORT} ✅`);
});
