const debug = require('debug')('geocodingController');

const positionStack = require('../../services/positionStack');

const geocodingController = {
    async forward(req, res) {
        debug(req.query);
        const gps = await positionStack.forward(req.query);
        debug(gps);
        res.json(gps);
    },
    async reverse(req, res) {
        debug(req.query);
        const address = await positionStack.reverse(req.query);
        debug(address);
        res.json(address);
    },
};

module.exports = geocodingController;
