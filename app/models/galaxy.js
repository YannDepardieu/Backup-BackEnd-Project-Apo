// const debug = require('debug')('Model:Galaxy');
const CoreModel = require('./coreModel');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class Galaxy extends CoreModel {
    scientific_name;

    traditional_name;

    name;

    img_url;

    constellation_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'galaxy';

    static routeName = 'galaxies';

    constructor(obj) {
        super(obj);
        this.scientific_name = obj.scientific_name;
        this.traditional_name = obj.traditional_name;
        this.name = obj.name;
        this.img_url = obj.img_url;
        this.constellation_id = obj.constellation_id;
    }
}

module.exports = Galaxy;
