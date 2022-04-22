// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Model:Constellation');
const CoreModel = require('./coreModel');
const pgPool = require('../db/pgPool');
const ApiError = require('../errors/apiError');

class Constellation extends CoreModel {
    name;

    latin_name;

    scientific_name;

    img_url;

    history;

    spotting;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'constellation';

    static routeName = 'constellations';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.latin_name = obj.latin_name;
        this.img_url = obj.img_url;
        this.history = obj.history;
        this.spotting = obj.spotting;
    }

    static async selectAll() {
        const result = await pgPool.query(`
            SELECT
                constellation.id,
                constellation.name as name,
                constellation.latin_name as latin_name,
                constellation.scientific_name as scientific_name,
                constellation.img_url as img_url,
                constellation.history as history,
                constellation.spotting as spotting,
                (SELECT array_agg(json_build_object(
                    'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
                )) AS myths FROM myth WHERE constellation.id = myth.constellation_id),
                (SELECT array_agg(json_build_object(
                    'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
                    'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
                )) AS stars FROM star WHERE constellation.id = star.constellation_id),
                (SELECT array_agg(json_build_object(
                    'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
                    galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
                )) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id)
            FROM "constellation"
            GROUP BY constellation.id
            ORDER BY constellation.id;
        `);
        return result.rows;
    }

    static async selectByPk(id) {
        // Another way of doing the query on top but with WHERE
        const SQL = {
            text: `
                SELECT
                    constellation.id,
                    constellation.name as name,
                    constellation.latin_name as latin_name,
                    constellation.scientific_name as scientific_name,
                    constellation.img_url as img_url,
                    constellation.history as history,
                    constellation.spotting as spotting,
                    star.stars, myth.myths, galaxy.galaxies
                FROM "constellation"
                CROSS JOIN LATERAL (
                    SELECT jsonb_agg( json_build_object(
                        'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
                    )) AS myths
                    FROM myth WHERE constellation.id = myth.constellation_id
                ) AS myth
                CROSS JOIN LATERAL (
                    SELECT jsonb_agg(json_build_object(
                        'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
                        'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
                    )) AS stars
                    FROM star WHERE constellation.id = star.constellation_id
                ) AS star
                CROSS JOIN LATERAL (
                    SELECT jsonb_agg(json_build_object(
                        'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
                        galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
                    )) AS galaxies
                    FROM galaxy WHERE constellation.id = galaxy.constellation_id
                ) AS galaxy
                WHERE constellation.id=$1
                GROUP BY constellation.id, star.stars, myth.myths, galaxy.galaxies
                ORDER BY constellation.id;
            `,
            values: [id],
        };
        const result = await pgPool.query(SQL);
        if (result.rowCount === 0) {
            throw new ApiError(`${this.tableName} not found for this id`, {
                statusCode: 404,
            });
        }
        return result.rows[0];
    }

    static async selectAllNames() {
        const SQL = 'SELECT id, name FROM constellation';
        const result = await pgPool.query(SQL);
        const resultAsClasses = [];
        result.rows.forEach((obj) => {
            const newObj = new this(obj);
            resultAsClasses.push(newObj);
        });
        return resultAsClasses;
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
        await pgPool.query(SQL);
        return { insert: true };
    }

    static async selectFavoriteByPk(userId, constellationId) {
        const SQL = {
            text: `
                SELECT *
                FROM constellation
                JOIN favorite_constellation
                ON constellation.id = favorite_constellation.constellation_id
                WHERE favorite_constellation.user_id = $1
                AND favorite_constellation.constellation_id = $2;
            `,
            values: [userId, constellationId],
        };
        const result = await pgPool.query(SQL);
        if (result.rows.length > 0) {
            throw new ApiError('Constellation already in favorite for this userId', {
                statusCode: 400,
            });
        }
        return result.rows[0];
    }

    static async selectAllFavorites(userId) {
        const SQL = {
            text: `
            SELECT
            constellation.id,
            constellation.name as name,
            constellation.latin_name as latin_name,
            constellation.scientific_name as scientific_name,
            constellation.img_url as img_url,
            constellation.history as history,
            constellation.spotting as spotting,
            (SELECT array_agg(json_build_object(
                'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
            )) AS myths FROM myth WHERE constellation.id = myth.constellation_id),
            (SELECT array_agg(json_build_object(
                'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
                'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
            )) AS stars FROM star WHERE constellation.id = star.constellation_id),
            (SELECT array_agg(json_build_object(
                'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
                galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
            )) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id)
        FROM "constellation"
        WHERE constellation.id = ANY (SELECT constellation_id FROM favorite_constellation)
        AND favorite_constellation.user_id = $1
        GROUP BY constellation.id
        ORDER BY constellation.id;
            
            `,
            values: [userId],
        };
        const result = await pgPool.query(SQL);
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
        const result = await pgPool.query(query);
        if (result.rows.length === 0) {
            throw new ApiError(
                `${this.tableName} to delete from favorite not found for this constellationId and this userId`,
                { statusCode: 404 },
            );
        }
        return { delete: true };
    }
}

module.exports = Constellation;
