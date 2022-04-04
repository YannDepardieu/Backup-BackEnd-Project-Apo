const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().alphanum().required(),
    event_datetime: Joi.date().min('now').timestamp().required(),
    latitude: Joi.number().precision(5).min(-200).max(200).required(),
    longitude: Joi.number().precision(5).min(-200).max(200).required(),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')).timestamp().required(),
}).required();
