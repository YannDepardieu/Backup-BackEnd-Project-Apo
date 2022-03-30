const debug = require('debug')('db:postgres');

const { Client } = require('pg');

debug('process.env.PG_URL === ', process.env.DATABASE_URL);

const client = new Client(process.env.DATABASE_URL);

client.connect((err) => (err ? debug(`ERREUR${err}`) : debug('DB connectée')));

module.exports = client;
