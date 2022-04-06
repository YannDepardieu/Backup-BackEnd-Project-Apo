const debug = require('debug')('commonController');
const ApiError = require('../../errors/apiError');

const Models = require('../../models');

const commonController = {
    // méthode pour récupérer un Model en fonction de l'entité demandée
    getModel: (entity) => {
        // on parcourt tous les Models que l'on a require
        debug('Models == ', Models);
        let ModelName;
        Models.forEach((Model) => {
            // si le nom est celui recherché (on lit la propriété statique du modèle pour savoir)
            // routeName est une prop static
            if (Model.routeName === entity || Model.tableName === entity) {
                ModelName = Model;
            }
        });

        if (!ModelName) {
            debug('ModelName = ', ModelName);
            throw new ApiError('Wrong entity', { statusCode: 404 });
        }
        return ModelName;
    },
    /**
     * Api Controller to get all the constellations myths
     * ExpressMiddleware signature
     * @param {object} _ Express req.object (not used)
     * @param {object} res Express response object
     * @return {string} Route API JSON response
     */
    async getAll(req, res) {
        const Model = commonController.getModel(req.params.entity);
        const response = await Model.findAll();
        res.json(response);
    },
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async getByPk(req, res) {
        const Model = commonController.getModel(req.params.entity);
        const response = await Model.findByPk(req.params.id);
        if (!response) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(response);
    },
};

module.exports = commonController;
