// const debug = require('debug')('Model:Event');
const CoreModel = require('./coreModel');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class Event extends CoreModel {
    name;

    event_datetime;

    latitude;

    longitude;

    recall_datetime;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'event';

    static routeName = 'events';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.event_datetime = obj.event_datetime;
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
        this.recall_datetime = obj.recall_datetime;
    }
}

module.exports = Event;
