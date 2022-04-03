/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
// If you launch node 1-importData.js from inside the data folder in the terminal, you need to expose the path
require('dotenv').config({ path: '../.env' });
// If you launch node data/1-importData.js from the project root in the terminal, you don't need to expose the path
require('dotenv').config();

const client = require('../app/db/postgres');

const user = require('./testUsers.json');
const place = require('./testPlaces.json');
const event = require('./testEvents.json');
const planet = require('./planets.json');
const constellation = require('./constellations.json');
const star = require('./stars.json');
const myth = require('./myths.json');

const allTables = { user, place, event, planet, constellation, star, myth };

const tables = Object.keys(allTables);
// console.log(tables);

//! Attention : la forme de la requête INSERT doit être double quote pour le nom de la table et les columns
//! ET single quote pour les values sinon ça marche pas :
//! INSERT INTO "tableName" ("field1", "field2", ...) VALUES ('value1', 'value2', ...) RETURNING *;

// Pour pouvoir utiliser await je dois être dans une fonction  async et pas dans
// le flux principal du programme.
// Je créé donc une IIFE async (une fonction exécuté aussi tôt quelle est déclaré)

(async () => {
    await client.query(
        `TRUNCATE TABLE
        "user", place, event, planet, constellation, galaxy, star, myth, reserve_event,
        save_place, favorite_constellation, prefer_planet RESTART IDENTITY;`,
    );

    tables.forEach(async (table) => {
        // console.log('allTables[table] = ', allTables[table]);
        let columns = '';

        Object.keys(allTables[table][0]).forEach((field, index) => {
            if (index < Object.keys(allTables[table][0]).length - 1) {
                columns += `"${field}", `;
            } else {
                columns += `"${field}"`;
            }
        });

        const queries = [];

        allTables[table].forEach((obj) => {
            let fields = '';
            const values = [];
            Object.values(obj).forEach((value, index) => {
                if (index < Object.values(obj).length - 1) {
                    values.push(value);
                    fields += `$${index + 1}, `;
                } else {
                    values.push(value);
                    fields += `$${index + 1}`;
                }
            });

            // console.log(`INSERT INTO "${table}" (${columns}) VALUES (${fields}) RETURNING *;`);
            // console.log('values == ', values);
            // console.log(
            //     '-------------------------------------------------------------------------',
            // );

            const query = client.query(
                `INSERT INTO "${table}" (${columns}) VALUES (${fields}) RETURNING *;`,
                [...values],
            );
            queries.push(query);
        });

        // Promise.all attend un array et renvoie un array
        await Promise.all(queries);
        // console.log('results = ', results);
    });
})();
