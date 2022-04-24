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
            SELECT * FROM view_myths_with_attributes
            WHERE id >= (
                SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
            )
            ORDER BY id LIMIT 1;`,
        };
        // Fonctionne aussi :
        // SELECT * FROM "myth" JOIN "constellation" ON constellation.id = myth.constellation_id
        // WHERE LENGTH(legend) > 0 ORDER BY  random() LIMIT 1;

        const result = await pgPool.query(SQL);
        return result.rows[0];
    }

    static async selectByPk(id) {
        const SQL = {
            text: ` SELECT * FROM view_myths_with_attributes WHERE id = $1; `,
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
