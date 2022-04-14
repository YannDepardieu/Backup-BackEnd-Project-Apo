// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Model:Place');
const CoreModel = require('./coreModel');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class Place extends CoreModel {
    name;

    address;

    postalcode;

    city;

    latitude;

    longitude;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'place';

    static routeName = 'places';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.address = obj.address;
        this.postalcode = obj.postalcode;
        this.city = obj.city;
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
    }

    static async selectAll(userId) {
        const result = await client.query(
            `
            SELECT place.id, place.name, place.address, place.latitude, place.longitude FROM "place"
            JOIN save_place
            ON place.id = save_place.place_id
            WHERE save_place.user_id = $1;`,
            [userId],
        );
        if (result.rows.length === 0) {
            throw new ApiError(`No Place found for this user`, {
                statusCode: 404,
            });
        }
        const resultAsClasses = [];
        result.rows.forEach((obj) => {
            const newObj = new this(obj);
            resultAsClasses.push(newObj);
        });
        return resultAsClasses;
    }

    static async selectByPk(userId, placeId) {
        const result = await client.query(
            `
            SELECT place.id, place.name, place.address, place.latitude, place.longitude FROM "place"
            JOIN save_place
            ON place.id = save_place.place_id
            WHERE save_place.user_id = $1
            AND place.id = $2;`,
            [userId, placeId],
        );
        if (result.rows.length === 0) {
            throw new ApiError(`Place not found for this user`, {
                statusCode: 404,
            });
        }
        return new this(result.rows[0]);
    }

    static async update(userId, placeId, input) {
        debug(userId, placeId, input);
        const fields = Object.keys(input).map((prop, index) => `"${prop}" = $${index + 1}`);
        const values = Object.values(input);
        debug(fields, values);
        const result = await client.query(
            `
            UPDATE "place"
            SET ${fields}
            FROM save_place
            WHERE save_place.user_id = $${fields.length + 1}
            AND place.id = $${fields.length + 2}
            AND place.id = save_place.place_id
            RETURNING place.id, place.name, place.address, place.latitude, place.longitude;
            `,
            [...values, userId, placeId],
        );
        debug(result.rows);
        if (result.rows.length === 0) {
            throw new ApiError(`Place not found for this user`, {
                statusCode: 404,
            });
        }
        return new this(result.rows[0]);
    }

    static async delete(userId, placeId) {
        const query = {
            text: `
                DELETE FROM "place"
                WHERE place.id = (
                    SELECT place.id FROM "place"
                    JOIN save_place
                    ON place.id = save_place.place_id
                    WHERE save_place.user_id = $1
                    AND place.id = $2
                )
                RETURNING *;
            `,
            values: [userId, placeId],
        };
        const result = await client.query(query);
        if (result.rows.length === 0) {
            throw new ApiError(`Place not found for this user`, {
                statusCode: 404,
            });
        }
        return { delete: true };
    }
}

module.exports = Place;
