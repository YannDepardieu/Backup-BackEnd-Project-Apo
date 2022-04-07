// const debug = require('debug')('commonController');
const ApiError = require('../../errors/apiError');

const commonController = {
    /**
     * Api Controller to get all the constellations myths
     * ExpressMiddleware signature
     * @param {object} _ Express req.object (not used)
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async getAll(req, res) {
        const { Model } = res.locals;
        const data = await Model.findAll();
        res.json(data);
    },
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON data
     */
    async getByPk(req, res) {
        const { Model } = res.locals;
        const data = await Model.findByPk(req.params.id);
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON data
     */
    async createOne(req, res) {
        const { Model } = res.locals;
        const data = await Model.insert(req.body);
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
};

module.exports = commonController;
