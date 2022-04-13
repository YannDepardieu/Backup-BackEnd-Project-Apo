const debug = require('debug')('Model:Event');
const CoreModel = require('./coreModel');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class Event extends CoreModel {
    name;

    event_datetime;

    latitude;

    longitude;

    recall_datetime;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'event';

    static routeName = 'events';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.event_datetime = obj.event_datetime;
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
        this.recall_datetime = obj.recall_datetime;
    }

    static async selectAll(userId) {
        const result = await client.query(
            `
            SELECT *, event.id FROM "event"
            JOIN reserve_event
            ON event.id = reserve_event.event_id
            WHERE reserve_event.user_id = $1;`,
            [userId],
        );
        if (result.rows.length === 0) {
            throw new ApiError(`No ${this.tableName} found for this user`, {
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

    static async selectByPk(userId, eventId) {
        const result = await client.query(
            `
            SELECT *, event.id FROM "event"
            JOIN reserve_event
            ON event.id = reserve_event.event_id
            WHERE reserve_event.user_id = $1
            AND event.id = $2;`,
            [userId, eventId],
        );
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this user`, {
                statusCode: 404,
            });
        }
        debug(result.rows[0]);
        return new this(result.rows[0]);
    }

    static async update(userId, eventId, input) {
        const fields = Object.keys(input).map((prop, index) => `"${prop}" = $${index + 1}`);
        const values = Object.values(input);

        const result = await client.query(
            `
            UPDATE "event"
            SET ${fields}
            FROM reserve_event
            WHERE reserve_event.user_id = $${fields.length + 1}
            AND event.id = $${fields.length + 2}
            AND event.id = reserve_event.event_id
            RETURNING *, event.id;
            `,
            [...values, userId, eventId],
        );
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this user`, {
                statusCode: 404,
            });
        }
        return new this(result.rows[0]);
    }

    static async delete(userId, eventId) {
        const query = {
            text: `
                DELETE FROM "event"
                WHERE event.id = (
                    SELECT event.id FROM "event"
                    JOIN reserve_event
                    ON event.id = reserve_event.event_id
                    WHERE reserve_event.user_id = $1
                    AND event.id = $2
                )
                RETURNING *;
            `,
            values: [userId, eventId],
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

module.exports = Event;
