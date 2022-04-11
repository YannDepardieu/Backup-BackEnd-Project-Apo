// eslint-disable-next-line no-unused-vars
const debug = require('debug')('commonController');
const ApiError = require('../../errors/apiError');

const commonController = {
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
     * A myth
     * @typedef {object} Myth
     * @property {string} origin - The myth origin
     * @property {string} img_name - The image name
     * @property {integer} constellation_id - Myth's constellation id
     * @property {integer} star_id - Myth's star id
     * @property {string} legend - The myth's content
     */
    /**
     * A planet
     * @typedef {object} Planet
     * @property {string} name - The planet name
     * @property {string} img_name - The image name
     */
    /**
     * A star
     * @typedef {object} Star
     * @property {string} traditional_name - Star's traditional name
     * @property {string} tradition - Star's myth or story
     * @property {string} name - Star's usual name
     * @property {string} img_name - Star's image name
     * @property {integer} constellation_id - Star's consellation id
     */
    /**
     * A user
     * @typedef {object} User
     * @property {string} firstname - The user name
     * @property {string} lastname - User last name
     * @property {string} email - User's email
     * @property {string} password - User's password
     * @property {integer} role - User's role
     * @property {integer} notification - Boolean user's authorisation for getting emails notifications
     */
    async getAll(_, res) {
        const { Model } = res.locals;
        const data = await Model.findAll();
        res.json(data);
    },
    /**
     * An event
     * @typedef {object} Event
     * @property {string} name - The event name
     * @property {string} event_datetime - Event date
     * @property {number} latitude - Event position latitude
     * @property {number} longitude - Event position longitude
     * @property {string} recall_datetime - Email notification recall date
     */
    /**
     * A place
     * @typedef {object} Place
     * @property {string} name - The place name
     * @property {string} address - Place address
     * @property {string} postalcode - Place address postal code
     * @property {string} city - Place address city
     * @property {integer} latitude - Place position latitude
     * @property {integer} longitude - Place position longitude
     */
    async getByPk(req, res) {
        const { Model } = res.locals;
        const data = await Model.findByPk(req.params.id);
        if (!data) {
            throw new ApiError(`${Model.tableName} not found`, { statusCode: 404 });
        }
        if (data.password) {
            delete data.password;
        }
        return res.json(data);
    },
    /**
     * A user inscription
     * @typedef {object} InscriptionUser
     * @property {string} firstname - firstname
     * @property {string} lastname - lastname
     * @property {string} email - email
     * @property {string} password - password
     * @property {string} role - role: user or admin
     * @property {boolean} notification - user's authorisation to get emails notifications
     */
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {InscriptionUser} req Express req.object
     * @param {InscriptionUser} res Express response object with crypted password
     * @returns {string} Route API JSON data
     */
    async createOne(req, res) {
        const { Model } = res.locals;
        const notUnique = await Model.isUnique(req.body);
        if (notUnique) {
            throw new ApiError(`This ${Model.tableName} is not unique`, { statusCode: 400 });
        }
        const data = await Model.insert(req.body);
        // debug(data);
        return res.json(data);
    },
    async deleteOne(req, res) {
        const { Model } = res.locals;
        const data = await Model.deleteByPk(req.params.id);
        if (!data) {
            throw new ApiError('Entry not found', { statusCode: 404 });
        }
        return res.json(data);
    },

    async update(req, res) {
        const { Model } = res.locals;
        const { id } = req.params;
        const element = await Model.findByPk(id);
        if (!element) {
            throw new ApiError(`This ${Model.tableName} does not exists`, { statusCode: 404 });
        }
        const notUnique = await Model.isUnique(req.body, id);
        debug('notUnique = ', notUnique);
        if (notUnique) {
            throw new ApiError(`This ${Model.tableName} is not unique`, { statusCode: 400 });
        }

        const output = await Model.update(id, req.body);

        return res.json(output);
    },
};

module.exports = commonController;
