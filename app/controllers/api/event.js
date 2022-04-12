// eslint-disable-next-line no-unused-vars
const debug = require('debug')('eventController');
// const ApiError = require('../../errors/apiError');
const Event = require('../../models/event');
const ReserveEvent = require('../../models/reserveEvent');
const { forward } = require('../../services/positionStack');

const eventController = {
    /**
     * EventInput
     * @typedef {object} CreatedEventInput
     * @property {string} name - Name of the event
     * @property {string} address - Address of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     */
    /**
     * AllEventsOutput
     * @typedef {object} GetAllEvents
     * @property {string} name - Name of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     * @property {string} latitude - latitude of the event
     * @property {string} longitude - longitude of the event
     */
    /**
     * Api controller to get one user myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async create(req, res) {
        const input = req.body;
        const gps = await forward(req.body);
        debug(gps);
        input.latitude = gps[0].latitude;
        input.longitude = gps[0].longitude;
        delete input.address;
        const event = await Event.insert(input);
        debug('id = ', event.id);
        const reserveEvent = await ReserveEvent.insert({
            event_id: event.id,
            user_id: req.decoded.user.id,
        });
        return res.json({ event, reserveEvent });
    },

    async getAll(req, res) {
        const events = await Event.selectAll(req.decoded.user.id);
        return res.json(events);
    },

    async getOne(req, res) {
        const eventId = req.params.id;
        const event = await Event.selectOne(req.decoded.user.id, eventId);
        return res.json(event);
    },
};

module.exports = eventController;
