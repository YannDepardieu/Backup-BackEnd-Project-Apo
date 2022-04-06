const debug = require('debug')('Model:Constellation');
const CoreModel = require('./index');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class Myth extends CoreModel {
    origin;

    img_name;

    constellation_id;

    star_id;

    planet_id;

    legend;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'myth';

    static routeName = 'myths';

    constructor(obj) {
        super(obj);
        this.origin = obj.origin;
        this.img_name = obj.img_name;
        this.constellation_id = obj.constellation_id;
        this.star_id = obj.star_id;
        this.legend = obj.legend;
    }

    static async findRandomWithConstellation() {
        const SQL = {
            text: `
                SELECT *
                FROM "myth"
                JOIN "constellation"
                ON constellation.id = myth.constellation_id
                WHERE myth.id >= (
                    SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
                )
                AND LENGTH(legend) > 0
                ORDER BY myth.id
                LIMIT 1;`,
        };
        const result = await client.query(SQL);
        debug(result);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found, id doesn't exist`, {
                statusCode: 404,
            });
        }

        return result.rows;
    }
}

module.exports = Myth;

// Fonctionne aussi :

// SELECT *
// FROM "myth"
// JOIN "constellation"
// ON constellation.id = myth.constellation_id
// WHERE LENGTH(legend) > 0
// ORDER BY  random()
// LIMIT 1;
