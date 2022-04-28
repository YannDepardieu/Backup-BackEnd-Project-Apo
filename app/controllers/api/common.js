// eslint-disable-next-line no-unused-vars
const debug = require('debug')('commonController');

const commonController = {
    /**
     * A constellation
     * @typedef {object} Constellation
     * @property {integer} id - Constellation id
     * @property {string} name - Constellation name
     * @property {string} latin_name - Constellation latin_name
     * @property {string} scientific_name - Constellation scientific name
     * @property {string} img_url - Constellation img_url
     * @property {string} history - Constellation history
     * @property {string} spotting - Constellation spotting
     */
    /**
     * A myth
     * @typedef {object} Myth
     * @property {integer} id - Myth id
     * @property {string} origin - Myth origin
     * @property {string} legend - Myth legend
     * @property {string} img_url - Myth img_url
     * @property {integer} constellation_id - Myth's constellation id
     * @property {integer} star_id - Myth's star id
     * @property {integer} planet_id - Myth's planet id
     */
    /**
     * A planet
     * @typedef {object} Planet
     * @property {integer} id - Planet id
     * @property {string} name -  Planet name
     * @property {string} img_url - Planet img_url
     */
    /**
     * A star
     * @typedef {object} Star
     * @property {integer} id - Star id
     * @property {string} letter - Myth origin
     * @property {string} traditional_name - Myth traditional_name
     * @property {string} tradition -  Myth name tradition
     * @property {string} name -  Myth name (traduction)
     * @property {string} img_url - Myth img_url
     * @property {integer} constellation_id - Star's consellation id
     */
    /**
     * A user
     * @typedef {object} User
     * @property {integer} id - id of the user
     * @property {string} firstname - The user name
     * @property {string} lastname - User last name
     * @property {string} email - User's email
     * @property {string} password - User's password
     * @property {integer} role - User's role
     * @property {integer} notification - Boolean user's authorisation for getting emails notifications
     */
    /**
     * An event
     * @typedef {object} Event
     * @property {integer} id - id of the event
     * @property {string} name - Name of the event
     * @property {string} event_datetime - Datetime of the event
     * @property {string} recall_datetime - Datetime of the recall
     * @property {integer} latitude - latitude of the event
     * @property {integer} longitude - longitude of the event
     */
    /**
     * A place
     * @typedef {object} Place
     * @property {string} id - Place id
     * @property {string} name - Place name
     * @property {string} address - Place address
     * @property {integer} latitude - Place position latitude
     * @property {integer} longitude - Place position longitude
     */
    /**
     * Api controller to get one constellation myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */

    async insert(req, res) {
        const { Model } = res.locals;
        // Throw an error if the properties of the element to insert, that should be unique, are not unique
        await Model.isUnique(req.body);
        const output = await Model.insert(req.body);
        // debug(data);
        return res.status(200).json(output);
    },

    async selectAll(_, res) {
        const { Model } = res.locals;
        debug(Model);
        const data = await Model.selectAll();
        const output = [];
        // Create copies of the objects, returned by the model query, adding the hidden private
        // property "id" that wouldn't be return in the json otherwise
        data.forEach((element) => output.push({ id: element.id, ...element }));
        res.status(200).json(output);
    },

    async selectByPk(req, res) {
        const { Model } = res.locals;
        const output = await Model.selectByPk(req.params.id);
        // If the query returns a user then the password won't be returned to the client (security)
        if (output.password) {
            delete output.password;
        }
        return res.status(200).json(output);
    },

    async update(req, res) {
        const { Model } = res.locals;
        const { id } = req.params;
        // Check if the element to update really exist
        await Model.selectByPk(id);
        // Throw an error if the properties of the element to update, that should be unique, are not unique
        await Model.isUnique(req.body, id);
        const output = await Model.update(id, req.body);
        return res.status(200).json(output);
    },

    async delete(req, res) {
        const { Model } = res.locals;
        // Check if the element to update really exist
        await Model.selectByPk(req.params.id);
        const output = await Model.delete(req.params.id);
        return res.status(200).json(output);
    },
};

module.exports = commonController;
