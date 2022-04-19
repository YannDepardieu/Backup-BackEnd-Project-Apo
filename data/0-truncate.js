/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
// If you launch node 1-importData.js from inside the data folder in the terminal, you need to expose the path
require('dotenv').config({ path: '../.env' });
// If you launch node data/1-importData.js from the project root in the terminal, you don't need to expose the path
require('dotenv').config();

const pgClient = require('../app/db/pgClient');

(async () => {
    try {
        await pgClient.query(
            `TRUNCATE TABLE
            "user", place, event, planet, constellation, galaxy, star, myth, reserve_event,
            save_place, favorite_constellation, prefer_planet RESTART IDENTITY;`,
        );
        await pgClient.originalClient.end();
        console.log('Connection ended - Seeding ok');
    } catch (error) {
        console.log('ERROOOOR = ', error);
    }
})();
