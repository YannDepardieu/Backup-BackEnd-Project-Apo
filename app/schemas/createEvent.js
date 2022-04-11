const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30).required(),
    event_datetime: Joi.date().min('now').timestamp().required(),
    latitude: Joi.number().precision(4).min(-90).max(90).required(),
    longitude: Joi.number().precision(4).min(-180).max(180).required(),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')).timestamp().required(),
}).required();
