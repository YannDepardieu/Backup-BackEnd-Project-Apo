// const debug = require('debug')('ApiController');

const Model = require('../../models/myth');

const mythController = {
    /**
     * A constellation with its myth
     * @typedef {object} Myth
     * @property {integer} id - Myth id
     * @property {string} origin - Myth origin
     * @property {string} legend - Myth legend
     * @property {string} img_url - Myth img_url
     * @property {Constellation} Constellation Constellation related to the myth
     * @property {Star} Star Star related to the myth
     * @property {Planet} Planet Planet related to the myth
     */

    /**
     * Constellation related to the myth
     * @typedef {object} Constellation
     * @property {integer} id - Constellation id
     * @property {string} name - Constellation name
     * @property {string} latin_name - Constellation latin_name
     * @property {string} scientific_name - Constellation scientific name
     * @property {string} img_url - Constellation img_url
     * @property {string} history - Constellation history
     * @property {string} spotting - Constellation spotting
     */
    /**
     * Star related to the constellation
     * @typedef {object} Star
     * @property {integer} id - Star id
     * @property {string} letter - Myth origin
     * @property {string} traditional_name - Myth traditional_name
     * @property {string} tradition -  Myth name tradition
     * @property {string} name -  Myth name (traduction)
     * @property {string} img_url - Myth img_url
     */
    /**
     * Planet related to the constellation
     * @typedef {object} Planet
     * @property {integer} id - Planet id
     * @property {string} name -  Planet name
     * @property {string} img_url - Planet img_url
     */
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async selectRandom(_, res) {
        const data = await Model.selectRandom();
        return res.status(200).json(data);
    },

    async selectByPk(req, res) {
        const data = await Model.selectByPk(req.params.id);
        return res.status(200).json(data);
    },
};

module.exports = mythController;
