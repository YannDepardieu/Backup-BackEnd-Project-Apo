// const debug = require('debug')('ApiController');
const ApiError = require('../../errors/apiError');

const Model = require('../../models/myth');

const mythController = {
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async getRandomWithConstellation(req, res) {
        const response = await Model.findRandomWithConstellation();
        if (!response) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(response);
    },
};

module.exports = mythController;
