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
console.log(tables);

(async () => {
    let tablesNames = '';
    // const tablesNames = tables.toString().split(',').join(', ');
    tables.forEach((table, index) => {
        if (index === 0) {
            tablesNames += `"${table}"`;
        } else {
            tablesNames += `, ${table}`;
        }
    });
    console.log(tablesNames);
    await client.query(
        `TRUNCATE TABLE
        "user", place, event, planet, constellation, galaxy, star, myth, reserve_event,
        save_place, favorite_constellation, prefer_planet RESTART IDENTITY;`,
    );
    // console.log(query);
    console.log('query ok');
    // const tableQuerys = [];

    tables.forEach((table) => {
        // console.log('allTables[table] = ', allTables[table]);
        let fields = '';
        Object.keys(allTables[table][0]).forEach((field, index) => {
            if (index < Object.keys(allTables[table][0]).length - 1) {
                fields += `"${field}", `;
            } else {
                fields += `"${field}"`;
            }
        });
        allTables[table].forEach((obj) => {
            let values = '';
            // console.log('obj === ', obj);
            Object.values(obj).forEach((value, index) => {
                if (index < Object.values(obj).length - 1) {
                    values += `"${value}", `;
                } else {
                    values += `"${value}"`;
                }
            });
            // console.log('table == ', table);
            // console.log('fields == ', fields);
            // console.log('values == ', values);
            console.log(`INSERT INTO "${table}" (${fields}) VALUES (${values}) RETURNING *;`);

            // const query = client.query(
            //     `
            //     INSERT INTO "${table}" (${fields}) VALUES (${values}) RETURNING *;
            //     `,
            // );
        });
    });

    // console.log(Object.entries(allTables)[0]);

    // Object.entries(allTables).forEach((table) => {
    //     const tableColumns = `"${Object.keys(table[1][0]).toString().split(',').join('", "')}"`;

    //     const tableParams = [];
    //     for (let i = 1; i <= Object.keys(table[1][0]).length; i += 1) {
    //         tableParams.push(`$${i}`);
    //     }
    //     const tableParamsQuery = tableParams.toString().split(',').join(', ');

    //     let tableParamsValues = '';
    //     table[1].forEach((value) => {
    //         // console.log(value);
    //         tableParamsValues += `${table[0]}.${value}`;
    //     });
    // console.log(tableParamsValues);

    // const query = client.query(
    //     `
    //     INSERT INTO "${table[0]}" (${tableColumns}) VALUES (${tableParamsQuery}) RETURNING *;
    //     `,
    //     [],
    // );
    // console.log(query);
    // });
})();

// categories.forEach((category) => {
//     debug('Processing category:', category.label);
//     const query = client.query(
//         `
//             INSERT INTO "category"
//             ("label", "route")
//             VALUES
//             ($1, $2)
//             RETURNING *;
//         `,
//         [category.label, category.route],
//     );
//     debug('Contenu de query', query);
//     categoryQueries.push(query);
// });
