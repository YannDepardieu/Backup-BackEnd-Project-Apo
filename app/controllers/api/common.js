const debug = require('debug')('commonController');
const ApiError = require('../../errors/apiError');

const Models = require('../../models');

const commonController = {
    // méthode pour récupérer un Model en fonction de l'entité demandée
    getModel: (entity) => {
        // on parcourt tous les Models que l'on a require
        debug('Models == ', Models);
        debug('typeof Models == ', typeof Models);
        let ModelName;
        Models.forEach((Model) => {
            // si le nom est celui recherché (on lit la propriété statique du modèle pour savoir)
            // routeName est une prop static
            if (Model.routeName === entity || Model.tableName === entity) {
                ModelName = Model;
            }
        });
        debug(ModelName);

        if (!ModelName) {
            debug('ModelName = ', ModelName);
            throw new ApiError('Wrong entity', { statusCode: 404 });
        }
        return ModelName;
    },
    /**
     * A constellation
     * @typedef {object} Constellation
     * @property {string} name - The constellation name
     * @property {string} latin_name - And its latin name
     * @property {string} img_name - With the image name
     * @property {string} story - The story of first discovering
     * @property {string} spotting - The spotting advices to locate it on sky
     */

    /**
     * An event
     * @typedef {object} Event
     * @property {string} name - The constellation name
     * @property {string} event_datetime - Event date time
     * @property {number} latitude - Event latitude position
     * @property {number} longitude - Event longitude position
     * @property {string} recall_datetime - Optional notification datetime
     */

    /**
     * A myth
     * @typedef {object} Myth
     * @property {string} origin - The constellation name
     * @property {string} img_name - Event date time
     * @property {integer} constellation_id - Event latitude position
     * @property {integer} star_id - Event longitude position
     * @property {string} legend - Optional notification datetime
     */

    /**
     * A place
     * @typedef {object} Place
     * @property {string} name - The constellation name
     * @property {string} address - Event date time
     * @property {string} postalcode - Event latitude position
     * @property {string} city - Event longitude position
     * @property {number} latitude - Optional notification datetime
     * @property {number} longitude - Optional notification datetime
     */

    /**
     * A planet
     * @typedef {object} Planet
     * @property {string} name - The constellation name
     * @property {string} img_name - Event date time
     */

    /**
     * Api Controller to get all the elements for an entity
     * ExpressMiddleware signature
     * @param {string} req Express req.params.entity
     * @param {[object]} res Express response object
     * @return {Constellation|Event} 200 - success response - application/json
     */
    async getAll(req, res) {
        // debug(req.params.entity);
        const Model = commonController.getModel(req.params.entity);
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
        const Model = commonController.getModel(req.params.entity);
        const data = await Model.findByPk(req.params.id);
        if (!data) {
            throw new ApiError('Constellation not found', { statusCode: 404 });
        }
        return res.json(data);
    },
};

module.exports = commonController;
