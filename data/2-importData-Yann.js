/* eslint-disable camelcase */
/* eslint-disable no-console */
// If you launch node 1-importData.js from inside the data folder in the terminal, you need to expose the path
require('dotenv').config({ path: '../.env' });
// If you launch node data/1-importData.js from the project root in the terminal, you don't need to expose the path
require('dotenv').config();

const bcrypt = require('bcryptjs');

const client = require('../app/db/client');

const user = require('./testUsers.json');
const place = require('./testPlaces.json');
const event = require('./testEvents.json');
const planet = require('./planets.json');
const constellation = require('./constellations.json');
const star = require('./stars.json');
const myth = require('./myths.json');
const favorite_constellation = require('./favorites_constellations.json');

const allTables = { user, place, event, planet, constellation, star, myth, favorite_constellation };

const tables = Object.keys(allTables);
// console.log(tables);

//! Attention : la forme de la requête INSERT doit être double quote pour le nom de la table et les columns
//! ET single quote pour les values sinon ça marche pas :
//! INSERT INTO "tableName" ("field1", "field2", ...) VALUES ('value1', 'value2', ...) RETURNING *;

// Pour pouvoir utiliser await je dois être dans une fonction  async et pas dans
// le flux principal du programme.
// Je créé donc une IIFE async (une fonction exécuté aussi tôt quelle est déclaré)

(async () => {
    try {
        await client.query(
            `TRUNCATE TABLE
            "user", place, event, planet, constellation, galaxy, star, myth, reserve_event,
            save_place, favorite_constellation, prefer_planet RESTART IDENTITY;`,
        );

        tables.forEach(async (table, i) => {
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
                    if (obj.password === value) {
                        // eslint-disable-next-line no-param-reassign
                        value = bcrypt.hashSync(value, 10);
                    }
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
            // console.log('results = ', results);;
            if (tables.length === i + 1) {
                await client.end();
                console.log('Fin connection - Seeding terminé');
            }
        });
        // setTimeout(async () => {
        //     await client.end();
        //     // await client.originalClient.end();
        //     console.log('Fin');
        // }, 5000);
    } catch (error) {
        console.trace(error);
    }
})();
