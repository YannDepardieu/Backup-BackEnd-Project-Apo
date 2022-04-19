/* eslint-disable no-console */

// The Client is used to seed the tables with the JS script in data folder.

const { Client } = require('pg');

console.log('process.env.PG_URL === ', process.env.DATABASE_URL);

const client = new Client(process.env.DATABASE_URL);

client.connect((err) => (err ? console.log(`ERREUR${err}`) : console.log('pgClient connected')));

// module.exports = client;

module.exports = {
    // We expose the original client just in case
    originalClient: client,
    // This method will intercept the queries in order to display them in the terminal with debug to be able to track
    // the queries. The spread operator transform several variables, that are passed in parameter, into an array
    async query(...params) {
        // console.log(...params);
        // The spread operator does the exact opposite and transform an array into a list of variable in parameter
        // So the query method of the client will be called exactly the same way as our module
        return this.originalClient.query(...params);
    },
};
