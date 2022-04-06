// const debug = require('debug')('Model:Planet');
const CoreModel = require('./index');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class Planet extends CoreModel {
    name;

    img_name;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'planet';

    static routeName = 'planets';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.img_name = obj.img_name;
    }
}

module.exports = Planet;
