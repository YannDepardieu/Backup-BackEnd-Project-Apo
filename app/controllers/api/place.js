// eslint-disable-next-line no-unused-vars
const debug = require('debug')('placeController');
const ApiError = require('../../errors/apiError');

const Place = require('../../models/place');
const savePlace = require('../../models/savePlace');
const { forward } = require('../../services/positionStack');

const placeController = {
    /**
     * Api controller to get, save and delete an user's place.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON data
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
    /**
     * A favorite place
     * @typedef {object} FavoritePlace
     * @property {integer} place_id - The place id
     * @property {integer} user_id - The user id
     */
    async selectAll(req, res) {
        const places = await Place.selectAll(req.decoded.user.id);
        const output = [];
        places.forEach((place) => output.push({ id: place.id, ...place }));
        return res.json(output);
    },
    async insert(req, res) {
        const address = {
            address: req.body.address,
        };
        const location = await forward(address);
        const place = {
            name: req.body.name,
            address: address.address,
            latitude: location[0].latitude,
            longitude: location[0].longitude,
        };
        const insertPlace = await Place.insert(place);
        if (!insertPlace) {
            throw new ApiError('Data not fount', { statusCode: 404 });
        }

        const data = {
            place_id: insertPlace.id,
            user_id: req.decoded.cleanedUser.id,
        };
        const favPlace = await savePlace.insert(data);
        return res.json(favPlace);
    },
    async selectByPk(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const place = await Place.selectByPk(userId, placeId);
        const output = { id: place.id, ...place };
        return res.json(output);
    },
    async update(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const input = req.body;
        const gps = await forward(input);
        input.latitude = gps[0].latitude;
        input.longitude = gps[0].longitude;
        // delete input.address;
        debug(userId, placeId, input);
        const place = await Place.update(userId, placeId, input);
        const output = { id: place.id, ...place };
        return res.json(output);
    },
    async delete(req, res) {
        const placeId = req.params.id;
        const userId = req.decoded.user.id;
        const output = await Place.delete(userId, placeId);
        return res.json(output);
    },
};
module.exports = placeController;
