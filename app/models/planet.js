// const debug = require('debug')('Model:Planet');
const CoreModel = require('./coreModel');
// const ApiError = require('../errors/apiError');

class Planet extends CoreModel {
    name;

    img_url;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'planet';

    static routeName = 'planets';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.img_url = obj.img_url;
    }
}

module.exports = Planet;
