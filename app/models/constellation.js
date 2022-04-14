// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Model:Constellation');
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

    static async selectAll() {
        const result = await client.query(`
            SELECT
                constellation.id,
                constellation.name as name,
                constellation.latin_name as latin_name,
                constellation.scientific_name as scientific_name,
                constellation.img_name as img_name,
                constellation.story as history,
                constellation.spotting as spotting,
                array_agg(json_build_object('origin', myth.origin, 'legend', myth.legend)) AS myth
            FROM "constellation"
            LEFT JOIN "myth"
            ON constellation.id = myth.constellation_id
            GROUP BY constellation.id
            ORDER BY constellation.id;
        `);
        return result.rows;
    }

    static async selectByPk(id) {
        const SQL = {
            text: `SELECT
                    constellation.id,
                    constellation.name as name,
                    constellation.latin_name as latin_name,
                    constellation.scientific_name as scientific_name,
                    constellation.img_name as img_name,
                    constellation.story as history,
                    constellation.spotting as spotting,
                    array_agg(json_build_object('origin', myth.origin, 'legend', myth.legend)) AS myth
                FROM "constellation"
                LEFT JOIN "myth"
                ON constellation.id = myth.constellation_id
                WHERE constellation.id=$1
                GROUP BY constellation.id
                ORDER BY constellation.id;`,
            values: [id],
        };
        const result = await client.query(SQL);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found, id doesn't exist`, {
                statusCode: 404,
            });
        }
        return result.rows;
    }

    static async selectAllNames() {
        const SQL = 'SELECT name FROM constellation';
        const data = await client.query(SQL);
        return data.rows;
    }

    static async insertFavorite(userId, constellationId) {
        const SQL = {
            text: `
                INSERT INTO "favorite_constellation" ("user_id", "constellation_id")
                VALUES ($1, $2)
                RETURNING *;
            `,
            values: [userId, constellationId],
        };
        const output = await client.query(SQL);
        if (output.rowCount === 0) {
            throw new ApiError(`User or Constellation not found`, {
                statusCode: 404,
            });
        }
        return { insert: true };
    }

    static async selectFavoriteByPk(userId, constellationId) {
        const SQL = {
            text: `
                SELECT
                    constellation.id,
                    constellation.name as name,
                    constellation.latin_name as latin_name,
                    constellation.scientific_name as scientific_name,
                    constellation.img_name as img_name,
                    constellation.story as history,
                    constellation.spotting as spotting,
                    array_agg(json_build_object('origin', myth.origin, 'legend', myth.legend)) AS myth
                FROM constellation
                LEFT JOIN myth
                ON constellation.id = myth.constellation_id
                JOIN favorite_constellation
                ON constellation.id = favorite_constellation.constellation_id
                WHERE favorite_constellation.user_id = $1
                AND favorite_constellation.constellation_id = $2
                GROUP BY constellation.id
                ORDER BY constellation.id;`,
            values: [userId, constellationId],
        };
        const result = await client.query(SQL);
        return result.rows;
    }

    static async selectAllFavorites(userId) {
        const SQL = {
            text: `
                SELECT
                    constellation.id,
                    constellation.name as name,
                    constellation.latin_name as latin_name,
                    constellation.scientific_name as scientific_name,
                    constellation.img_name as img_name,
                    constellation.story as history,
                    constellation.spotting as spotting,
                    array_agg(json_build_object('origin', myth.origin, 'legend', myth.legend)) AS myth
                FROM constellation
                LEFT JOIN myth
                ON constellation.id = myth.constellation_id
                JOIN favorite_constellation
                ON constellation.id = favorite_constellation.constellation_id
                WHERE favorite_constellation.user_id = $1
                GROUP BY constellation.id
                ORDER BY constellation.id;`,
            values: [userId],
        };
        const result = await client.query(SQL);
        return result.rows;
    }

    static async deleteFavorite(userId, constellationId) {
        const query = {
            text: `
                DELETE FROM favorite_constellation
                WHERE favorite_constellation.constellation_id = (
                    SELECT constellation.id FROM constellation
                    JOIN favorite_constellation
                    ON constellation.id = favorite_constellation.constellation_id
                    WHERE favorite_constellation.user_id = $1
                    AND constellation.id = $2
                )
                RETURNING *;
            `,
            values: [userId, constellationId],
        };
        const result = await client.query(query);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this user`, {
                statusCode: 404,
            });
        }
        return { delete: true };
    }
}

module.exports = Constellation;
