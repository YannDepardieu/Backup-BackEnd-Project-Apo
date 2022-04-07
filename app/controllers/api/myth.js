// const debug = require('debug')('ApiController');
const ApiError = require('../../errors/apiError');

const Model = require('../../models/myth');

const mythController = {
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON data
     */

    /**
     * A constellation with its myth
     * @typedef {object} RandomMyth
     * @property {integer} id - The myth id
     * @property {string} origin - Myth origin
     * @property {string} img_name - Myth image name
     * @property {integer} constellation_id - Myth's constellation id
     * @property {integer} star_id - Myth's star id
     * @property {integer} planet_id - Myth's planet id
     * @property {string} legend - Myth's legend
     * @property {string} created_at - Myth's entry DB date
     * @property {string} updated_at - Myth's last DB update date
     * @property {string} name - Myth's constellation name
     * @property {string} latin_name - Myth's constellation latin name
     * @property {string} scientific_name - Myth's constellation scientific name
     * @property {string} story - Myth's constellation story
     * @property {string} spotting - Myth's constellation spotting advices
     */
    async getRandomWithConstellation(_, res) {
        const data = await Model.findRandomWithConstellation();
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
};

module.exports = mythController;
