const commonController = require('./common');
const constellationController = require('./constellation');
const mythController = require('./myth');
const geocodingController = require('./geocoding');
const userController = require('./user');
const eventController = require('./event');

const indexController = {
    test(_, res) {
        res.status(200).json({
            name: 'API',
            version: '1.0',
            status: 200,
            message: "Bienvenue sur l'API !",
        });
    },
    /**
     * Default API controller to show documentation url.
     * ExpressMiddleware signature
     * @param {object} req Express request object (not used)
     * @param {object} res Express response object
     * @return {object} Route API JSON object
     */
    home(req, res) {
        const fullUrl = `${req.protocol}://${req.get('host')}`;
        return res.json({
            documentation_url: `${fullUrl}${process.env.API_DOCUMENTATION_ROUTE}`,
        });
    },
};

module.exports = {
    indexController,
    commonController,
    constellationController,
    mythController,
    geocodingController,
    userController,
    eventController,
};
