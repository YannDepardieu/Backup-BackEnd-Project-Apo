const debug = require('debug')('Model:Constellation');
const CoreModel = require('./index');
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
            text: `SELECT *
            FROM "constellation"
            JOIN "myth"
            ON constellation.id = myth.constellation_id
            WHERE constellation.id=$1`,
            values: [id],
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

module.exports = Constellation;
