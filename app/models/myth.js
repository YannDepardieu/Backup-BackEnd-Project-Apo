const debug = require('debug')('Model:Myth');
const CoreModel = require('./coreModel');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class Myth extends CoreModel {
    origin;

    img_url;

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
        this.img_url = obj.img_url;
        this.constellation_id = obj.constellation_id;
        this.star_id = obj.star_id;
        this.legend = obj.legend;
    }

    static async selectRandom() {
        const SQL = {
            text: `
                SELECT
                    myth.id, myth.origin, myth.img_url, myth.constellation_id, myth.star_id, myth.planet_id, myth.legend,
                    json_build_object('id', constellation.id, 'name', constellation.name,
                    'latin_name', constellation.latin_name, 'scientific_name', constellation.scientific_name,
                    'img_url', constellation.img_url, 'story', constellation.story, 'spotting', constellation.spotting)
                    AS constellation,
                    json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet,
                    json_build_object('id', star.id, 'name', star.name, 'tradition_name', star.traditional_name,
                    'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id) AS star
                FROM "myth"
                JOIN "constellation" ON constellation.id = myth.constellation_id
                LEFT JOIN planet ON planet.id = myth.planet_id
                LEFT JOIN star ON star.id = myth.star_id
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

    static async selectByPk(id) {
        const SQL = {
            text: `
                SELECT
                    myth.id, myth.origin, myth.img_url, myth.constellation_id, myth.star_id, myth.planet_id, myth.legend,
                    json_build_object('id', constellation.id, 'name', constellation.name,
                    'latin_name', constellation.latin_name, 'scientific_name', constellation.scientific_name,
                    'img_url', constellation.img_url, 'story', constellation.story, 'spotting', constellation.spotting)
                    AS constellation,
                    json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet,
                    json_build_object('id', star.id, 'name', star.name, 'tradition_name', star.traditional_name,
                    'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id) AS star
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
