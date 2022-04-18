// eslint-disable-next-line no-unused-vars
const debug = require('debug')('geocodingController');

const positionStack = require('../../services/positionStack');

const geocodingController = {
    /**
     * A position
     * @typedef {object} Position
     * @property {string} latitude - The address position latitude
     * @property {string} longitude - The address position longitude
     */
    async forward(req, res) {
        const gps = await positionStack.forward(req.query);
        res.status(200).json(gps);
    },
    // pas utile.....
    /**
     * An address
     * @typedef {object} Address
     * @property {string} name - The address name
     * @property {string} number - The address number
     * @property {string} street - The address street
     * @property {string} postal_code - The address postal code
     * @property {string} region - The address region
     * @property {string} country - The address country
     */
    async reverse(req, res) {
        const address = await positionStack.reverse(req.query);
        res.status(200).json(address);
    },
};

module.exports = geocodingController;
