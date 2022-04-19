// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Model:Myth');
const CoreModel = require('./coreModel');
const pgPool = require('../db/pgPool');
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
                myth.id, myth.origin, myth.img_url, myth.legend,
                (
                    SELECT json_build_object(
                        'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
                        'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
                        'history', constellation.history, 'spotting', constellation.spotting
                    )AS constellation
                    FROM "constellation" WHERE constellation.id = myth.constellation_id
                ),
                (
                    SELECT json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet
                    FROM planet WHERE planet.id = myth.planet_id
                ),
                (
                    SELECT json_build_object(
                        'id', star.id, 'letter', star.letter, 'name', star.name, 'tradition_name', star.traditional_name,
                        'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id
                    ) AS star
                    FROM star WHERE star.id = myth.star_id
                )
            FROM "myth"
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

        const result = await pgPool.query(SQL);
        return result.rows[0];
    }

    static async selectByPk(id) {
        const SQL = {
            text: `
            SELECT
                myth.id, myth.origin, myth.img_url, myth.legend,
                (
                    SELECT json_build_object(
                        'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
                        'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
                        'history', constellation.history, 'spotting', constellation.spotting
                    )AS constellation
                    FROM "constellation" WHERE constellation.id = myth.constellation_id
                ),
                (
                    SELECT json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet
                    FROM planet WHERE planet.id = myth.planet_id
                ),
                (
                    SELECT json_build_object(
                        'id', star.id, 'letter', star.letter, 'name', star.name, 'tradition_name', star.traditional_name,
                        'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id
                    ) AS star
                    FROM star WHERE star.id = myth.star_id
                )
            FROM "myth"
            WHERE myth.id = $1
            AND LENGTH(legend) > 0;
            `,
            values: [id],
        };
        const result = await pgPool.query(SQL);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this id`, {
                statusCode: 404,
            });
        }
        return result.rows[0];
    }
}

module.exports = Myth;
