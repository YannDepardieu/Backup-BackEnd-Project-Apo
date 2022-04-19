// const debug = require('debug')('Model:Galaxy');
const CoreModel = require('./coreModel');
// const ApiError = require('../errors/apiError');

class FavConst extends CoreModel {
    user_id;

    constellation_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'favorite_constellation';

    static routeName = 'favorites_constellations';

    constructor(obj) {
        super(obj);
        this.user_id = obj.user_id;
        this.constellation_id = obj.constellation_id;
    }
}

module.exports = FavConst;
