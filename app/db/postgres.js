const debug = require('debug')('db:postgres:sql');

// Rather than created and connected a Client, we will create a "pool" of client and let our module manage
// the connections of several clients depending on the needs

// The Pool will be able to do several queries at the same time providing a faster access to the database
const { Pool } = require('pg');

const config = {
    connectionString: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV === 'production') {
    // This is a special configuration for the Heroku production version
    // It will avoir errors messages concerning the SSL
    config.ssl = {
        rejectUnauthorized: false,
    };
}

const pool = new Pool(config);

pool.connect((err) => (err ? debug(`ERREUR${err}`) : debug('DB connectée')));

module.exports = {
    // We expose the original client just in case
    originalClient: pool,

    // This method will intercept the queries in order to display them in the terminal with debug to be able to track
    // the queries. The spread operator transform several variables, that are passed in parameter, into an array
    async query(...params) {
        debug(...params);
        // The spread operator does the exact opposite and transform an array into a list of variable in parameter
        // So the query method of the client will be called exactly the same way as our module
        return this.originalClient.query(...params);
    },
};
