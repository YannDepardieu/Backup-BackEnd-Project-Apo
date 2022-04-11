const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30),
    event_datetime: Joi.date().min('now').timestamp(),
    latitude: Joi.number().precision(4).min(-90).max(90),
    longitude: Joi.number().precision(4).min(-180).max(180),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')).timestamp(),
})
    .min(1)
    .required();
