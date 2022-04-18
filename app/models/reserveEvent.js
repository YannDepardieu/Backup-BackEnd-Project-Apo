// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Model:reserveEvent');
const CoreModel = require('./coreModel');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class ReserveEvent extends CoreModel {
    event_id;

    user_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'reserve_event';

    static routeName = 'reserve_event';

    constructor(obj) {
        super(obj);
        this.event_id = obj.event_id;
        this.user_id = obj.user_id;
    }
}

module.exports = ReserveEvent;
