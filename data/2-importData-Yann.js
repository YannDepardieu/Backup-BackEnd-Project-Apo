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
const myth = require('./myths.json');

const allTables = { user, place, event, planet, constellation, myth };

const tables = Object.keys(allTables);
// console.log(tables);

//! Attention : la forme de la requête INSERT doit être double quote pour le nom de la table et les fields
//! ET single quote pour les values sinon ça marche pas :
//! INSERT INTO "tableName" ("field1", "field2", ...) VALUES ('value1', 'value2', ...) RETURNING *;

// Pour pouvoir utiliser await je dois être dans une fonction  async et pas dans
// le flux principal du programme.
// Je créé donc une IIFE async (une fonction exécuté aussi tôt quelle est déclaré)

(async () => {
    // let tablesNames = '';
    // tables.forEach((table, index) => {
    //     if (index === 0) {
    //         tablesNames += `"${table}"`;
    //     } else {
    //         tablesNames += `, ${table}`;
    //     }
    // });
    // console.log(tablesNames);
    await client.query(
        `TRUNCATE TABLE
        "user", place, event, planet, constellation, galaxy, star, myth, reserve_event,
        save_place, favorite_constellation, prefer_planet RESTART IDENTITY;`,
    );

    tables.forEach(async (table) => {
        // console.log('allTables[table] = ', allTables[table]);
        let fields = '';
        Object.keys(allTables[table][0]).forEach((field, index) => {
            if (index < Object.keys(allTables[table][0]).length - 1) {
                fields += `"${field}", `;
            } else {
                fields += `"${field}"`;
            }
        });

        const queries = [];

        allTables[table].forEach(async (obj) => {
            let values = '';

            Object.values(obj).forEach((value, index) => {
                const regex = /'/gm;
                if (regex.test(value)) {
                    // eslint-disable-next-line no-param-reassign
                    value = value.replace(/'/gm, "\\'");
                    console.log(value);
                }

                if (index < Object.values(obj).length - 1 && typeof value === 'string') {
                    values += `'${value}', `;
                } else if (index < Object.values(obj).length - 1 && typeof value !== 'string') {
                    values += `${value}, `;
                } else if (typeof value === 'string') {
                    values += `'${value}'`;
                } else {
                    values += `${value}`;
                }
            });
            // console.log('table == ', table);
            // console.log('fields == ', fields);
            // console.log('values == ', values);
            // console.log(`INSERT INTO "${table}" (${fields}) VALUES (${values}) RETURNING *;`);

            const query = client.query(
                `INSERT INTO "${table}" (${fields}) VALUES (${values}) RETURNING *;`,
            );
            queries.push(query);
        });

        // Promise.all attend un array et renvoie un array
        await Promise.all(queries);
        // console.log('results = ', results);
    });
})();
