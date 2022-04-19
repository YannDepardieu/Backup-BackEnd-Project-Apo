// const debug = require('debug')('Model:Galaxy');
const CoreModel = require('./coreModel');
// const ApiError = require('../errors/apiError');

class SavePlace extends CoreModel {
    place_id;

    user_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'save_place';

    static routeName = 'save_places';

    constructor(obj) {
        super(obj);
        this.place_id = obj.place_id;
        this.user_id = obj.user_id;
    }
}

module.exports = SavePlace;
