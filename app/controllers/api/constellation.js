// eslint-disable-next-line no-unused-vars
const debug = require('debug')('constellationController');
const ApiError = require('../../errors/apiError');

const Constellation = require('../../models/constellation');
// const favConst = require('../../models/favoriteConstellation');

const constellationController = {
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON data
     */

    // maybe get it off created at, updated at, star id, planet id ?
    /**
     * A constellation with its myth
     * @typedef {object} ConstellationMyth
     * @property {integer} id - The event name
     * @property {string} name - Event date
     * @property {string} latin_name - Event position latitude
     * @property {string} scientific_name - Event position longitude
     * @property {string} img_name - Email notification recall date
     * @property {string} story - Email notification recall date
     * @property {string} spotting - Email notification recall date
     * @property {string} created_at - Email notification recall date
     * @property {string} updated_at - Email notification recall date
     * @property {string} origin - Email notification recall date
     * @property {integer} star_id - Email notification recall date
     * @property {integer} planet_id - Email notification recall date
     * @property {string} legend - Email notification recall date
     */
    async selectAll(_, res) {
        const output = await Constellation.selectAll();
        return res.status(200).json(output);
    },

    async selectByPk(req, res) {
        const output = await Constellation.selectByPk(req.params.id);
        return res.status(200).json(output);
    },

    async selectAllNames(_, res) {
        const data = await Constellation.selectAllNames();
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.status(200).json(data);
    },

    async insertFavorite(req, res) {
        const userId = req.decoded.user.id;
        const constId = req.body.constellation_id;
        const exist = await Constellation.selectFavoriteByPk(userId, constId);
        debug('exist = ', exist);
        if (exist.length > 0) {
            throw new ApiError('Constellation already in favorite', { statusCode: 400 });
        }
        const output = await Constellation.insertFavorite(userId, constId);
        return res.status(200).json(output);
    },

    async selectAllFavorites(req, res) {
        const userId = req.decoded.user.id;
        const output = await Constellation.selectAllFavorites(userId);
        return res.status(200).json(output);
    },

    async deleteFavorite(req, res) {
        const eventId = req.params.id;
        const userId = req.decoded.user.id;
        const output = await Event.delete(userId, eventId);
        return res.status(200).json(output);
    },
};

module.exports = constellationController;
