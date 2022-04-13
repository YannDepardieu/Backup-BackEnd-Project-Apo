// eslint-disable-next-line no-unused-vars
const debug = require('debug')('placeController');
const ApiError = require('../../errors/apiError');

const Model = require('../../models/place');
const savePlace = require('../../models/savePlace');
const positionStack = require('../../services/positionStack');

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
    async getOnePlace(req, res) {
        const { id } = req.params;
        const place = await Model.findByPk(id);
        if (!place) {
            throw new ApiError('Place not fount', { statusCode: 404 });
        }
        debug(place);
        return res.status(200).json(place);
    },
    async createNewPlace(req, res) {
        const address = {
            address: req.body.address,
        };
        const location = await positionStack.forward(address);
        const place = {
            name: req.body.name,
            address: address.address,
            latitude: location[0].latitude,
            longitude: location[0].longitude,
        };
        const insertPlace = await Model.insert(place);
        if (!insertPlace) {
            throw new ApiError('Data not fount', { statusCode: 404 });
        }

        const data = {
            place_id: insertPlace.id,
            user_id: req.decoded.cleanedUser.id,
        };
        const favPlace = await savePlace.insert(data);
        if (!favPlace) {
            throw new ApiError('Favorite Place not found', { statusCode: 404 });
        }
        return res.status(200).json(favPlace);
    },
    async getAllPlaces(_, res) {
        const placesIds = await savePlace.findAll();
        debug(placesIds);
        if (!placesIds) {
            throw new ApiError('Data not found', { statusCode: 404 });
        }

        const userPlaces = [];
        await Promise.all(
            placesIds.map(async (fav) => {
                debug(fav);
                const place = await Model.findByPk(fav.place_id);
                if (place) {
                    userPlaces.push({ id: place.id, ...place });
                }
            }),
        );
        return res.status(200).json(userPlaces);
    },
    async deleteOnePlace(req, res) {
        const deleted = await Model.deleteFavPlace(req.params.id);
        if (!deleted) {
            throw new ApiError('Place not found', { statusCode: 404 });
        }
        return res.status(200).json({ delete: true });
    },
};

module.exports = placeController;
