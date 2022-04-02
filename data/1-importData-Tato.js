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
    // const tablesNames = tables.toString().split(',').join(', ');
    // await client.query(`TRUNCATE TABLE IF EXISTS ${tablesNames} RESTART IDENTITY`);

    // const tableQuerys = [];

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

    Object.entries(allTables).forEach((table) => {
        const tableColumns = `"${Object.keys(table[1][0]).toString().split(',').join('", "')}"`;

        const tableParams = [];
        for (let i = 1; i <= Object.keys(table[1][0]).length; i += 1) {
            tableParams.push(`$${i}`);
        }
        const tableParamsQuery = tableParams.toString().split(',').join(', ');

        let tableParamsValues = '';
        table[1].forEach((value) => {
            // console.log(value);
            tableParamsValues += `${table[0]}.${value}`;
        });
        console.log(tableParamsValues);

        const query = client.query(
            `
            INSERT INTO "${table[0]}" (${tableColumns}) VALUES (${tableParamsQuery}) RETURNING *;
            `,
            [],
        );
        console.log(query);
    });
})();
