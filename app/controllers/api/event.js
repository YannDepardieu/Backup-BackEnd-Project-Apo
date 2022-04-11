// eslint-disable-next-line no-unused-vars
const debug = require('debug')('evetnController');

const ApiError = require('../../errors/apiError');

const Event = require('../../models/event');

const eventController = {
    /**
     * Event Input
     * @typedef {object} EventInput
     * @property {string} name - Name of the event
     * @property {string} address - Address of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     */
    /**
     * Api controller to get one user myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async createOne(req) {
        debug(req.body);
        // debug('found ', found);
        // if (found) {
        //     throw new ApiError(`${User.tableName} is not unique`, { statusCode: 404 });
        // }
        // const user = await User.insert(req.body);
        // delete user.password;
        // return res.json(user);
    },
};

module.exports = eventController;
