// eslint-disable-next-line no-unused-vars
const debug = require('debug')('constellationController');

const Constellation = require('../../models/constellation');
// const favConst = require('../../models/favoriteConstellation');

const constellationController = {
    // maybe get it off created at, updated at, star id, planet id ?
    /**
     * A constellation with its attributes
     * @typedef {object} ConstellationWithAttributesOutput
     * @property {integer} id - Constellation id
     * @property {string} name - Constellation name
     * @property {string} latin_name - Constellation latin_name
     * @property {string} scientific_name - Constellation scientific name
     * @property {string} img_url - Constellation img_url
     * @property {string} history - Constellation history
     * @property {string} spotting - Constellation spoting
     * @property {array<Myth>} Myths All myths related to the constellation
     * @property {array<Star>} Stars All stars forming the constellation
     * @property {array<Galaxy>} Galaxies All galaxies forming the constellation
     */
    /**
     * All Myths related to the constellation
     * @typedef {object} Myth
     * @property {integer} id - Myth id
     * @property {string} origin - Myth origin
     * @property {string} legend - Myth legend
     * @property {string} img_url - Myth img_url
     */
    /**
     * All Stars related to the constellation
     * @typedef {object} Star
     * @property {integer} id - Star id
     * @property {string} letter - Myth origin
     * @property {string} traditional_name - Myth traditional_name
     * @property {string} tradition -  Myth name tradition
     * @property {string} name -  Myth name (traduction)
     * @property {string} img_url - Myth img_url
     */
    /**
     * All Stars related to the constellation
     * @typedef {object} Galaxy
     * @property {integer} id - Galaxy id
     * @property {string} scientific_name - Galaxy scientific_name
     * @property {string} traditional_name - Galaxy traditional_name
     * @property {string} name -  Galaxy name
     * @property {string} img_url - Galaxy img_url
     */

    /**
     * Api controller to get one constellation with its attributes by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async selectAll(_, res) {
        const output = await Constellation.selectAll();
        return res.status(200).json(output);
    },

    async selectByPk(req, res) {
        const output = await Constellation.selectByPk(req.params.id);
        return res.status(200).json(output);
    },

    /**
     * A constellation with its attributes
     * @typedef {object} ConstellationNameOutput
     * @property {integer} id - Constellation id
     * @property {string} name - Constellation name
     */
    async selectAllNames(_, res) {
        const result = await Constellation.selectAllNames();
        const output = [];
        result.forEach((element) => output.push({ id: element.id, ...element }));
        return res.status(200).json(output);
    },

    /**
     * Add constellation in favorite using it's id
     * @typedef {object} ConstellationAddFavoriteInput
     * @property {integer} constellation_id - Constellation id
     */
    async insertFavorite(req, res) {
        const userId = req.decoded.user.id;
        const constId = req.body.constellation_id;
        await Constellation.selectByPk(constId);
        await Constellation.selectFavoriteByPk(userId, constId);
        const output = await Constellation.insertFavorite(userId, constId);
        return res.status(201).json(output);
    },

    async selectAllFavorites(req, res) {
        const userId = req.decoded.user.id;
        const output = await Constellation.selectAllFavorites(userId);
        return res.status(200).json(output);
    },

    async deleteFavorite(req, res) {
        const userId = req.decoded.user.id;
        const constId = req.params.id;
        const output = await Constellation.deleteFavorite(userId, constId);
        return res.status(200).json(output);
    },
};

module.exports = constellationController;
