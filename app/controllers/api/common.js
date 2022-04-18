// eslint-disable-next-line no-unused-vars
const debug = require('debug')('commonController');
const ApiError = require('../../errors/apiError');

const commonController = {
    /**
     * A constellation
     * @typedef {object} Constellation
     * @property {string} name - The constellation name
     * @property {string} latin_name - And its latin name
     * @property {string} img_url - With the image name
     * @property {string} history - The history of first discovery
     * @property {string} spotting - The spotting advices to locate it on sky
     */
    /**
     * A myth
     * @typedef {object} Myth
     * @property {string} origin - The myth origin
     * @property {string} img_url - The image name
     * @property {integer} constellation_id - Myth's constellation id
     * @property {integer} star_id - Myth's star id
     * @property {string} legend - The myth's content
     */
    /**
     * A planet
     * @typedef {object} Planet
     * @property {string} name - The planet name
     * @property {string} img_url - The image name
     */
    /**
     * A star
     * @typedef {object} Star
     * @property {string} traditional_name - Star's traditional name
     * @property {string} tradition - Star's tradition name
     * @property {string} name - Star's usual name
     * @property {string} img_url - Star's image name
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
    async selectAll(_, res) {
        const { Model } = res.locals;
        debug(Model);
        const data = await Model.selectAll();
        const output = [];
        data.forEach((element) => output.push({ id: element.id, ...element }));
        res.status(200).json(output);
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
    async selectByPk(req, res) {
        const { Model } = res.locals;
        const data = await Model.selectByPk(req.params.id);
        if (data.password) {
            delete data.password;
        }
        return res.status(200).json(data);
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
     * @return {string} Route API JSON data
     */
    async insert(req, res) {
        const { Model } = res.locals;
        await Model.isUnique(req.body);
        const data = await Model.insert(req.body);
        // debug(data);
        return res.status(200).json(data);
    },
    async delete(req, res) {
        const { Model } = res.locals;
        const data = await Model.delete(req.params.id);
        if (!data) {
            throw new ApiError('Entry not found', { statusCode: 404 });
        }
        return res.status(200).json(data);
    },

    async update(req, res) {
        const { Model } = res.locals;
        const { id } = req.params;
        await Model.selectByPk(id);
        await Model.isUnique(req.body, id);
        const output = await Model.update(id, req.body);
        return res.status(200).json(output);
    },
};

module.exports = commonController;
