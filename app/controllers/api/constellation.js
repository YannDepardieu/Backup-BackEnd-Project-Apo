// const debug = require('debug')('ApiController');
const ApiError = require('../../errors/apiError');

const Model = require('../../models/constellation');

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
    async getByPkWithMyths(req, res) {
        const data = await Model.findByPkWithMyths(req.params.id);
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
    async getAllNames(req, res) {
        const data = await Model.constellationsNames();
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
};

module.exports = constellationController;
