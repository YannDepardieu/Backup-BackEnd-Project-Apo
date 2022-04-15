/* eslint-disable no-console */

// The Client is used to seed the tables with the JS script in data folder.

const { Client } = require('pg');

console.log('process.env.PG_URL === ', process.env.DATABASE_URL);

const client = new Client(process.env.DATABASE_URL);

client.connect((err) => (err ? console.log(`ERREUR${err}`) : console.log('DB connectée')));

module.exports = client;
