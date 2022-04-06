// const debug = require('debug')('ApiController');
const ApiError = require('../../errors/apiError');

const Model = require('../../models/constellation');

const constellationController = {
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async getByPkWithMyths(req, res) {
        const response = await Model.findByPkWithMyths(req.params.id);
        if (!response) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(response);
    },
};

module.exports = constellationController;
