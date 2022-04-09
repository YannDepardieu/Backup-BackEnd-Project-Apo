// const debug = require('debug')('Model:Constellation');
const CoreModel = require('./coreModel');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class Constellation extends CoreModel {
    name;

    latin_name;

    scientific_name;

    img_name;

    story;

    spotting;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'constellation';

    static routeName = 'constellations';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.latin_name = obj.latin_name;
        this.img_name = obj.img_name;
        this.story = obj.story;
        this.spotting = obj.spotting;
    }

    static async findByPkWithMyths(id) {
        const SQL = {
            // text: `SELECT *
            // FROM "constellation"
            // JOIN "myth"
            // ON constellation.id = myth.constellation_id
            // WHERE constellation.id=$1`,

            // new query:
            text: `SELECT
                        constellation.id, 
                        constellation.name as name,
                        constellation.latin_name as latin_name,
                        constellation.scientific_name as scientific_name,
                        constellation.img_name as img_name,
                        constellation.story as history,
                        constellation.spotting as spotting,
                        array_agg(json_build_object(myth.origin, myth.legend)) AS myth_with_origin
                    FROM "constellation"
                    JOIN "myth"
                    ON constellation.id = myth.constellation_id
                    WHERE constellation.id=$1
                    GROUP BY constellation.id;`,
            values: [id],
        };
        const result = await client.query(SQL);
        // debug(result.rows);
        // an exception was thown, but now, first check if there's no myth related
        // so we can send anyway the constellation
        if (result.rows.length === 0) {
            // debug('length 0');
            const constellationSQL = {
                text: `SELECT * FROM constellation WHERE id=$1`,
                values: [id],
            };
            const constellation = await client.query(constellationSQL);
            // debug(constellation.rows);
            if (constellation.rows.length === 0) {
                throw new ApiError(`${this.tableName} not found, id doesn't exist`, {
                    statusCode: 404,
                });
            }
            return constellation.rows;
        }

        return result.rows;
    }

    static async constellationsNames() {
        const SQL = 'SELECT name FROM constellation';
        const data = await client.query(SQL);
        // debug(data.rows);
        return data.rows;
    }
}

module.exports = Constellation;
