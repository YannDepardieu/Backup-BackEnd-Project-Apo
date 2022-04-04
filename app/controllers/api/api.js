// const debug = require('debug')('ApiController');
const { ApiError } = require('../../middlewares/errorHandler');
const coreModel = require('../../models/coreModel');

module.exports = {
    /**
     * Api Controller to get the home Daily Myth
     * ExpressMiddleware signature
     * @param {object} _ Express req.object (not used)
     * @param {object} res Express response object
     * @return {string} Route API JSON response
     */
    dailyMyth(_, res) {
        const response = coreModel.oneDailyMyth();
        // debug(response);
        res.json(response);
    },
    /**
     * Api Controller to get all the constellations myths
     * ExpressMiddleware signature
     * @param {object} _ Express req.object (not used)
     * @param {object} res Express response object
     * @return {string} Route API JSON response
     */
    getAllConstellations(_, res) {
        const response = coreModel.findAllConstellations();
        res.json(response);
    },
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    getConstellationByPk(req, res) {
        const response = coreModel.findConstellationByPk(req.params.id);
        if (!response) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(response);
    },
};
