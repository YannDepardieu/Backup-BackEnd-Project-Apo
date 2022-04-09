const debug = require('debug')('Model:Myth');
const CoreModel = require('./coreModel');
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
        // Fonctionne aussi :
        // SELECT * FROM "myth" JOIN "constellation" ON constellation.id = myth.constellation_id
        // WHERE LENGTH(legend) > 0 ORDER BY  random() LIMIT 1;

        const result = await client.query(SQL);
        debug(result);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found, id doesn't exist`, {
                statusCode: 404,
            });
        }

        return result.rows;
    }

    static async oneMyth(id) {
        const SQL = {
            text: `
                SELECT
                    myth.id as myth_id, myth.origin, myth.img_name as myth_img, myth.legend as myth,
                    constellation.id as constellation_id, constellation.name as constellation_name,
                    constellation.latin_name as constellation_latin_name,
                    constellation.scientific_name as constellation_scientific_name, constellation.img_name as constellation_img,
                    constellation.story as constellation_history, constellation.spotting as constellation_spotting,
                    planet.id as planet_id, planet.name as planet_name, planet.img_name as planet_img,
                    star.id as star_id, star.name as star_name, star.traditional_name as star_tradition_name,
                    star.tradition as star_tradition, star.img_name as star_img, star.constellation_id as star_constellation
                FROM myth
                INNER JOIN constellation ON myth.constellation_id = constellation.id
                LEFT JOIN planet ON planet.id = myth.planet_id
                LEFT JOIN star ON star.id = myth.star_id
                WHERE myth.id = $1
            `,
            values: [id],
        };
        const data = await client.query(SQL);
        debug(data.rows);
        return data.rows;
    }
}

module.exports = Myth;
