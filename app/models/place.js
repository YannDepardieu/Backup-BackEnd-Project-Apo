// const debug = require('debug')('Model:Place');
const CoreModel = require('./index');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class Place extends CoreModel {
    name;

    address;

    postalcode;

    city;

    latitude;

    longitude;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'place';

    static routeName = 'places';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.address = obj.address;
        this.postalcode = obj.postalcode;
        this.city = obj.city;
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
    }
}

module.exports = Place;
