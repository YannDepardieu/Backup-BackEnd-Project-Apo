// eslint-disable-next-line no-unused-vars
const debug = require('debug')('placeController');

const Place = require('../../models/place');
const SavePlace = require('../../models/savePlace');
const { forward } = require('../../services/positionStack');

const placeController = {
    /**
     * Api controller to get, save and delete an user's place.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
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

    async insert(req, res) {
        const input = {
            address: req.body.address,
        };
        const location = await forward(input);
        const place = {
            name: req.body.name,
            address: input.address,
            latitude: location[0].latitude,
            longitude: location[0].longitude,
        };
        const insertPlace = await Place.insert(place);
        const data = {
            place_id: insertPlace.id,
            user_id: req.decoded.user.id,
        };
        await SavePlace.insert(data);
        const output = { id: insertPlace.id, ...insertPlace };
        return res.status(200).json(output);
    },

    async selectAll(req, res) {
        const places = await Place.selectAll(req.decoded.user.id);
        const output = [];
        places.forEach((place) => output.push({ id: place.id, ...place }));
        return res.status(200).json(output);
    },

    async selectByPk(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const place = await Place.selectByPk(userId, placeId);
        const output = { id: place.id, ...place };
        return res.status(200).json(output);
    },

    async update(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const input = req.body;
        if (input.address) {
            const gps = await forward(input);
            input.latitude = gps[0].latitude;
            input.longitude = gps[0].longitude;
        }
        const place = await Place.update(userId, placeId, input);
        const output = { id: place.id, ...place };
        return res.status(200).json(output);
    },

    async delete(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const output = await Place.delete(userId, placeId);
        return res.status(200).json(output);
    },
};
module.exports = placeController;
