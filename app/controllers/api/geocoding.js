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
        debug(req.query);
        const gps = await positionStack.forward(req.query);
        debug(gps);
        res.json(gps);
    },
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
        debug(req.query);
        const address = await positionStack.reverse(req.query);
        debug(address);
        res.json(address);
    },
};

module.exports = geocodingController;
