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
     * @property {string} img_url - Myth image name
     * @property {integer} constellation_id - Myth's constellation id
     * @property {integer} star_id - Myth's star id
     * @property {integer} planet_id - Myth's planet id
     * @property {string} legend - Myth's legend
     * @property {string} name - Myth's constellation name
     * @property {string} latin_name - Myth's constellation latin name
     * @property {string} scientific_name - Myth's constellation scientific name
     * @property {string} history - Myth's constellation history
     * @property {string} spotting - Myth's constellation spotting advices
     */
    async selectRandom(_, res) {
        const data = await Model.selectRandom();
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.status(200).json(data);
    },
    /**
     * A myth with its celestial body
     * @typedef {object} FullMyth
     * @property {integer} myth_id - The myth id
     * @property {string} origin - Myth origin
     * @property {string} myth_img - Myth image name
     * @property {string} myth - The myth itself
     * @property {integer} constellation_id - Myth's constellation id
     * @property {string} constellation_name - The constellation name
     * @property {string} constellation_latin_name - And its latin name
     * @property {string} constellation_scientific_name - And its latin name
     * @property {string} constellation_img - With the image name
     * @property {string} constellation_story - The story of first discovering
     * @property {string} constellation_spotting - The spotting advices to locate it on sky
     * @property {integer} planet_id - Planet's id
     * @property {integer} planet_name - Planet's name
     * @property {integer} planet_img - Planet's image
     * @property {integer} star_id - Star's id
     * @property {string} star_name - Star's french name
     * @property {string} star_tradition_name - Star's traditional name
     * @property {string} star_tradition - Star's origin
     * @property {string} star_img - Star's image
     * @property {string} star_constellation - Constellation id star belongs to
     */

    async selectByPk(req, res) {
        const data = await Model.selectByPk(req.params.id);
        if (!data) {
            throw new ApiError('Myth not found', { statusCode: 404 });
        }
        return res.status(200).json(data);
    },
};

module.exports = mythController;
