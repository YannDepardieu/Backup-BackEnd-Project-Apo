// eslint-disable-next-line no-unused-vars
const debug = require('debug')('eventController');
// const ApiError = require('../../errors/apiError');
const Event = require('../../models/event');
const ReserveEvent = require('../../models/reserveEvent');
const { forward } = require('../../services/positionStack');

const eventController = {
    /**
     * Input object to create or update an event
     * @typedef {object} EventInput
     * @property {string} name - Name of the event
     * @property {string} address - Address of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     */
    /**
     * Output object of the event
     * @typedef {object} EventOutput
     * @property {integer} id - id of the event
     * @property {string} name - Name of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     * @property {integer} latitude - latitude of the event
     * @property {integer} longitude - longitude of the event
     */
    /**
     * Api controller to create an event bound to a user
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async insert(req, res) {
        const input = req.body;
        const gps = await forward(req.body);
        input.latitude = gps[0].latitude;
        input.longitude = gps[0].longitude;
        delete input.address;
        const event = await Event.insert(input);
        await ReserveEvent.insert({
            event_id: event.id,
            user_id: req.decoded.user.id,
        });
        return res.status(201).json({ id: event.id, ...event });
    },

    async selectAll(req, res) {
        const events = await Event.selectAll(req.decoded.user.id);
        const output = [];
        events.forEach((element) => output.push({ id: element.id, ...element }));
        return res.status(200).json(output);
    },

    async selectByPk(req, res) {
        const eventId = req.params.id;
        const event = await Event.selectByPk(req.decoded.user.id, Number(eventId));
        const output = { id: event.id, ...event };
        return res.status(200).json(output);
    },

    async update(req, res) {
        const eventId = req.params.id;
        const userId = req.decoded.user.id;
        const input = req.body;
        if (input.address) {
            const gps = await forward(input);
            input.latitude = gps[0].latitude;
            input.longitude = gps[0].longitude;
            delete input.address;
        }
        const event = await Event.update(userId, eventId, input);
        const output = { id: event.id, ...event };
        return res.status(200).json(output);
    },

    async delete(req, res) {
        const eventId = req.params.id;
        const userId = req.decoded.user.id;
        const output = await Event.delete(userId, eventId);
        return res.status(200).json(output);
    },
};

module.exports = eventController;
