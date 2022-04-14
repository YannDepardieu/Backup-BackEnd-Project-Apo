// const debug = require('debug')('Model:Star');
const CoreModel = require('./coreModel');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class Star extends CoreModel {
    traditional_name;

    tradition;

    name;

    img_url;

    constellation_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'star';

    static routeName = 'stars';

    constructor(obj) {
        super(obj);
        this.traditional_name = obj.traditional_name;
        this.tradition = obj.tradition;
        this.name = obj.name;
        this.img_url = obj.img_url;
        this.constellation_id = obj.constellation_id;
    }
}

module.exports = Star;
